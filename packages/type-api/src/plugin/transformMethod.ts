import type ESTree from 'estree';
import { walk } from 'estree-walker';
import type { ProgramNode } from 'rollup';
import { parseAst } from 'rollup/parseAst';

export function transformMethod(code: string) {
    const parser = new ModuleParser(code);
    const notableNodes = {
        typeApiImport: parser.getImport('@meteor-vite/type-api'),
        calls: parser.callExpressions,
        defineMethodCall: parser.getCallExpression({ type: 'Identifier', name: 'defineMethod' }),
    }
    
    return {
        AST: parser.AST,
        notableNodes,
    };
}

class ModuleParser {
    public readonly AST: ProgramNode;
    public readonly callExpressions: ESTree.CallExpression[] = [];
    
    constructor(code: string) {
        this.AST = parseAst(code);
        walk(this.AST, {
            enter: (node) => {
                if (node.type === 'CallExpression') {
                    this.callExpressions.push(node);
                }
            }
        })
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
    
    public getCallExpression(callee: ESTree.Identifier | Pick<ESTree.MemberExpression, 'type' | 'object' | 'property'>) {
        return this.callExpressions.filter((node) => {
            if (node.callee.type !== callee.type) {
                return;
            }
            if (callee.type === 'Identifier') {
                return true;
            }
            if (callee.type !== 'MemberExpression') {
                return;
            }
            if (node.callee.type !== 'MemberExpression') {
                return;
            }
            if (node.callee.object.type !== callee.object.type) {
                return;
            }
            return true;
        })
    }
}