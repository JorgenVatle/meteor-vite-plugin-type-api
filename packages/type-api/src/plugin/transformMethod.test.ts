import { inspect } from 'node:util';
import { describe, expect, it } from 'vitest';
import { transformMethod } from './transformMethod';

const MOCK_MODULE = {
    // language="javascript"
    namedImport: `
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
    wildcardImport: `
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
    defaultImport: `
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
)('Usage: %s', (name, code) => {
    const { AST } = transformMethod(MOCK_MODULE.namedImport);
    
    it('Has an AST', () => {
        console.log(inspect(AST, { depth: 4, colors: true }));
        
        expect(AST).toBeTruthy();
    })
});


