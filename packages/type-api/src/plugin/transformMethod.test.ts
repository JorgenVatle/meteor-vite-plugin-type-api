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
    `
}

describe('Named type-api import', () => {
    
    it('Can parse ASTs', () => {
        const { AST } = transformMethod(MOCK_MODULE.namedImport);
        
        console.log(inspect(AST, { depth: 4, colors: true }));
        
        expect(AST).toBeTruthy();
    })
})


