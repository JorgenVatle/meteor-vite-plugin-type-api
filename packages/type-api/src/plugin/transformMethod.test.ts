import { inspect } from 'node:util';
import { expect, it } from 'vitest';
import { transformMethod } from './transformMethod';

// language="javascript"
const code = `
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
`

it('Can parse ASTs', () => {
    const { AST } = transformMethod(code);
    
    console.log(inspect(AST, { depth: 4, colors: true }));
    
    expect(AST).toBeTruthy();
})