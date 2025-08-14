import type ESTree from 'estree';
import { inspect } from 'node:util';
import { describe, expect, it } from 'vitest';
import { transformMethod } from './transformMethod';

const MOCK_MODULE = {
    // language="javascript"
    'named import': `
        // <editor-fold desc="Inline template">
        import { defineMethod } from '@meteor-vite/type-api';
        
        export const createLink = defineMethod('links.create', {
            handler: () => {
                return {
                    myLink: { href: 'http://example.com' }
                }
            }
        });
        
        export const updateLink = defineMethod('links.update', {
            handler: (params) => {
                return 'this should be omitted from client script';
            }
        })
    // </editor-fold>
    `,
    
    // language="javascript"
    'wildcard import': `
        // <editor-fold desc="Inline template">
        import * as TypeApi from '@meteor-vite/type-api';
        
        export const createLink = TypeApi.defineMethod('links.create', {
            handler: () => {
                return {
                    myLink: { href: 'http://example.com' }
                }
            }
        });
        
        export const updateLink = TypeApi.defineMethod('links.update', {
            handler: (params) => {
                return 'this should be omitted from client script';
            }
        })
    // </editor-fold>
    `,
    
    // language="javascript"
    'default import': `
        // <editor-fold desc="Inline template">
        import TypeApi from '@meteor-vite/type-api';
        
        export const createLink = TypeApi.defineMethod('links.create', {
            handler: () => {
                return {
                    myLink: { href: 'http://example.com' }
                }
            }
        });
        
        export const updateLink = TypeApi.defineMethod('links.update', {
            handler: (params) => {
                return 'this should be omitted from client script';
            }
        })
    // </editor-fold>
    `,
}

describe.each(
    Object.entries(MOCK_MODULE)
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
            replacement,
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


