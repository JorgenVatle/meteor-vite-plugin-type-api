import { ObjectExpressionModel } from '@/ast-models/ObjectExpressionModel';
import { traverse } from 'estree-toolkit';
import { parseAst } from 'rollup/parseAst';
import { describe, expect, it } from 'vitest';

const CODE_SNIPPETS = {
    // language=javascript
    basic: `
    runTest({
        numberField: 1,
        stringField: 'lorem ipsum',
        nestedObjectField: {
            hello: 'world'
        }
    })
    `
}

describe('Expression model', () => {
    const AST = parseAst(CODE_SNIPPETS.basic);
    let model: ObjectExpressionModel;
    traverse(AST, {
        CallExpression(path) {
            // @ts-expect-error need to narrow the type first
            model = new ObjectExpressionModel(path.get('arguments')[0])
        }
    });
    
    it('can get properties', () => {
        expect(model.properties.length).toBeGreaterThan(0);
    });
    
    it('parses the expcted number of props', () => {
        expect(model.properties.length).toBe(3);
    })
})