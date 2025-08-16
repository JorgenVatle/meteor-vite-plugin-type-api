export const MOCK_MODULE_METHODS = {
    // language="javascript"
    'named import': `
        import { defineMethod } from '@meteor-vite/type-api';
        
        export const createLink = defineMethod({
            name: 'links.create',
            method: () => {
                return {
                    myLink: { href: 'http://example.com' }
                }
            }
        });
        
        export const updateLink = defineMethod({
            name: 'links.update',
            method: (params) => {
                return 'this should be omitted from client script';
            }
        })
    `,
    
    // language="javascript"
    // 'wildcard import': `
    //     import * as TypeApi from '@meteor-vite/type-api';
    //
    //     export const createLink = TypeApi.defineMethod({
    //         name: 'links.create',
    //         method: () => {
    //             return {
    //                 myLink: { href: 'http://example.com' }
    //             }
    //         }
    //     });
    //
    //     export const updateLink = TypeApi.defineMethod({
    //         name: 'links.update',
    //         method: (params) => {
    //             return 'this should be omitted from client script';
    //         }
    //     })
    // `,
    //
    // // language="javascript"
    // 'default import': `
    //     import TypeApi from '@meteor-vite/type-api';
    //
    //     export const createLink = TypeApi.defineMethod({
    //         name: 'links.create',
    //         method: () => {
    //             return {
    //                 myLink: { href: 'http://example.com' }
    //             }
    //         }
    //     });
    //
    //     export const updateLink = TypeApi.defineMethod({
    //         name: 'links.update',
    //         method: (params) => {
    //             return 'this should be omitted from client script';
    //         }
    //     })
    // `,
}