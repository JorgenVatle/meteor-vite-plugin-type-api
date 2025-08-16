import { defineMethod } from '@/common/defineResource';
import * as v from 'valibot';
import { describe, expectTypeOf, it } from 'vitest';

describe('defineMethod', () => {
    const schema = v.object({
        href: v.string(),
        title: v.string(),
    });
    
    it('will infer run() method parameters', () => {
        defineMethod({
            schema,
            run: ({ href, title }) => {
                expectTypeOf(href).toEqualTypeOf<string>();
                expectTypeOf(title).toEqualTypeOf<string>();
            }
        })
    });
    
    it('yields a promise when called', () => {
        const createLink = defineMethod({
            schema: v.optional(schema),
            run: () => {
                return {
                    href: 'http://example.com',
                    title: 'Example',
                }
            }
        });
        
        expectTypeOf(createLink(undefined)).toEqualTypeOf<
            Promise<{
                href: string;
                title: string;
            }>
        >();
    })
    
})