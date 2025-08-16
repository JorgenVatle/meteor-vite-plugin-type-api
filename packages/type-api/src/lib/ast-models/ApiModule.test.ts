import { ApiModule } from '@/lib/ast-models/ApiModule';
import { ENTRY_MODULE } from '@/lib/Environments';
import { MOCK_MODULE_METHODS } from '@/test/_mocks/methods';
import { describe, expect, it } from 'vitest';

describe.each(Object.entries(MOCK_MODULE_METHODS))('ApiModule: %s', (type, code) => {
    // Todo: only named imports are supported for now
    const skip = !type.includes('named');
    
    const apiModule = ApiModule.parse({
        filePath: '/foo/test.methods.ts',
        code,
    })
    
    it.skipIf(skip)('parses defineMethod calls', () => {
        expect(apiModule.info.methods.length).toBeGreaterThan(0);
    });
    
    it.skipIf(skip)('parses definePublication calls', () => {
        expect(apiModule.info.publications.length).toEqual(1);
    })
    
    it.skipIf(skip)('parses method names', () => {
        expect(apiModule.info.methods[0]?.name).toEqual('links.create')
    });
    
    describe('Client transforms', () => {
        apiModule.transform('client');
        
        it.skipIf(skip)('can be transformed into client code', () => {
            const code = apiModule.code;
            console.log(code);
            expect(code).not.toContain('should be omitted');
            expect(code).not.toContain('Secret');
            expect(code).toContain('links.create');
            expect(code).toContain('links.update');
        });
        
        it.skipIf(skip)('Rewrites library import paths', () => {
            expect(apiModule.code).toContain(ENTRY_MODULE.client);
        })
    })
    
    
    describe('ResourceDefinition: Client', () => {
        const method = apiModule.info.methods[0];
        method?.transform('client');
        
        it.skipIf(skip)('generates method client code', () => {
            console.log(method?.code);
            expect(method?.code).toContain('links.create');
        });
        
        it.skipIf(skip)('strips out server-side code', () => {
            expect(method?.code).not.toContain('console');
            expect(method?.code).not.toContain('This should be omitted');
            expect(method?.code).not.toContain('handle');
        });
        
        it.skipIf(skip)('assigns a defaultName to defineMethod calls', () => {
            expect(method?.code).to.contain('_defaultName');
        });
        
        it.skipIf(skip)('has a default name', () => {
            expect(method?.defaultName).toBeTruthy();
            expect(method?.defaultName).toContain('test');
            expect(method?.defaultName).toContain('createLink');
        })
    })
    
    
})