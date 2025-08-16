import { ApiModule } from '@/lib/ast-models/ApiModule';
import { MOCK_MODULE_METHODS } from '@/test/_mocks/methods';
import { bench, describe } from 'vitest';

describe('Parser', () => {
    bench('Full module', () => {
        ApiModule.parse({
            filePath: '/test/foo.methods.ts',
            code: MOCK_MODULE_METHODS['named import'],
        });
    })
    
    bench('With performance mode', () => {
        ApiModule.parse({
            filePath: '/test/foo.methods.ts',
            code: MOCK_MODULE_METHODS['named import'],
            performanceMode: true,
        });
    })
})