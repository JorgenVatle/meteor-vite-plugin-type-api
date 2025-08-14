import { inspect } from 'node:util';
import { describe, expect, it } from 'vitest';
import { MOCK_MODULE_METHODS } from '../../test/_mocks/methods';
import { transformMethod } from './transformMethod';

describe.each(
    Object.entries(MOCK_MODULE_METHODS)
)('Using %s', (name, code) => {
    const { methodNames } = transformMethod(code);
    
    it('Parses method names', () => {
        console.log(inspect({ methodNames }, { colors: true }));
        expect(methodNames.length).toBeGreaterThan(0);
        expect(methodNames).toContain('links.create');
        expect(methodNames).toContain('links.update');
    });
    
});


