import { parseAst } from 'rollup/parseAst';

export function transformMethod(code: string) {
    const AST = parseAst(code);
    
    return {
        AST,
    }
}