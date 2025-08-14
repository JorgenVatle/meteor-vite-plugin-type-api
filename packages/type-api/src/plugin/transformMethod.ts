import type { ProgramNode } from 'rollup';
import { parseAst } from 'rollup/parseAst';

export function transformMethod(code: string) {
    const parser = new ModuleParser(code);
    const notableNodes = {
        typeApiImport: parser.getImport('@meteor-vite/type-api'),
    }
    
    return {
        AST: parser.AST,
        notableNodes,
    };
}

class ModuleParser {
    public readonly AST: ProgramNode;
    
    constructor(code: string) {
        this.AST = parseAst(code);
    }
    
    public getImport(source: string) {
        for (const node of this.AST.body) {
            if (node.type !== 'ImportDeclaration') {
                continue;
            }
            if (node.source.value !== source) {
                continue;
            }
            return node;
        }
    }
}