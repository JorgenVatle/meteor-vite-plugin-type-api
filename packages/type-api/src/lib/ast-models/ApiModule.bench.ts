import { ApiModule } from '@/ast-models/ApiModule';
import { USAGE_EXAMPLES } from '@/tests/_mocks/CodeSnippets';
import { bench, describe } from 'vitest';

describe('Parser', () => {
    bench('Full module', () => {
        ApiModule.parse({
            filePath: '/test/foo.methods.ts',
            code: USAGE_EXAMPLES.namedImport,
        });
    })
    
    bench('With performance mode', () => {
        ApiModule.parse({
            filePath: '/test/foo.methods.ts',
            code: USAGE_EXAMPLES.namedImport,
            performanceMode: true,
        });
    })
})