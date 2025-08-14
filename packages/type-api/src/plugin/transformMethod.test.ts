import type ESTree from 'estree';
import { inspect } from 'node:util';
import { describe, expect, it } from 'vitest';
import { MOCK_MODULE_METHODS } from '../../test/_mocks/methods';
import { transformMethod } from './transformMethod';

describe.each(
    Object.entries(MOCK_MODULE_METHODS)
)('Using %s', (name, code) => {
    const { AST, methodCalls, typeApiImport, methodNames, parser } = transformMethod(code);
    
    it('Has an AST', () => {
        console.log(inspect(AST, { depth: 6, colors: true }));
        
        expect(AST).toBeTruthy();
    });
    
    it('Located an import for @meteor-vite/type-api', () => {
        console.log(inspect(typeApiImport, { depth: 6, colors: true }));
        expect(typeApiImport).toBeTruthy();
    });
    
    it('Parses call expressions', () => {
        console.log(inspect(methodCalls, { depth: 6, colors: true }));
        expect(methodCalls.length).toBeGreaterThan(0);
    });
    
    it('Parses method names', () => {
        console.log(inspect({ methodNames }, { colors: true }));
        expect(methodNames.length).toBeGreaterThan(0);
        expect(methodNames).toContain('links.create');
        expect(methodNames).toContain('links.update');
    });
    
    it('Can replace imported method calls', () => {
        const replacement: ESTree.Literal = {
            type: 'Literal',
            value: 'REPLACEMENT SUCCESSFUL',
        }
        const result = parser.replaceImportedCallExpressions({
            moduleId: '@meteor-vite/type-api',
            replace: () => replacement,
            identifier: {
                type: 'Identifier',
                name: 'defineMethod',
            },
        })
        console.log(inspect(result, { depth: 6, colors: true }));
        expect(result.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    type: 'ExportNamedDeclaration',
                    declaration: expect.objectContaining({
                        type: 'VariableDeclaration',
                        declarations: [
                            expect.objectContaining({
                                type: 'VariableDeclarator',
                                init: replacement,
                            })
                        ]
                    })
                } satisfies Partial<ESTree.Node>)
            ])
        );
        expect(parser.code).toContain(replacement.value);
    })
});


