import type ESTree from 'estree';
import { inspect } from 'node:util';
import { describe, expect, it } from 'vitest';
import { MOCK_MODULE_METHODS } from '../../test/_mocks/methods';
import { ModuleParser } from './ModuleParser';
import { transformMethod } from './transformMethod';

describe.each(
    Object.entries(MOCK_MODULE_METHODS)
)('Using %s', (name, code) => {
    const parser = new ModuleParser(code);
    
    it('Has an AST', () => {
        console.log(inspect(parser.AST, { depth: 6, colors: true }));
        
        expect(parser.AST).toBeTruthy();
    });
    
    it('Can locate import expressions by name', () => {
        const result = parser.getImport('@meteor-vite/type-api');
        console.log(inspect(result, { depth: 6, colors: true }));
        expect(result).toBeTruthy();
    })
    
    it('Parses can locate call expressions by id', () => {
        const result = parser.getImportedMethodCalls(parser.getImport('@meteor-vite/type-api'), {
            type: 'Identifier',
            name: 'defineMethod',
        });
        console.log(inspect(result, { depth: 6, colors: true }));
        expect(result.length).toBeGreaterThan(0);
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