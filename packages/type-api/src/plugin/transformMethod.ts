import type ESTree from 'estree';
import { walk } from 'estree-walker';
import type { ProgramNode } from 'rollup';
import { parseAst } from 'rollup/parseAst';

export function transformMethod(code: string) {
    const parser = new ModuleParser(code);
    
    const typeApiImport = parser.getImport('@meteor-vite/type-api');
    let expectedExpressionCallee: ESTree.Identifier | Pick<ESTree.MemberExpression, 'property' | 'type' | 'object'> | null = null;
    
    for (const specifier of typeApiImport.specifiers) {
        const importSpecifier = getImportSpecifier(specifier, {
            imported: {
                type: 'Identifier',
                name: 'defineMethod',
            },
        });
        
        if (importSpecifier) {
            expectedExpressionCallee = importSpecifier.local;
            break;
        }
        
        if (specifier.type === 'ImportDefaultSpecifier') {
            expectedExpressionCallee = {
                type: 'MemberExpression',
                object: specifier.local,
                property: {
                    type: 'Identifier',
                    name: 'defineMethod',
                }
            };
            break;
        }
        
        if (specifier.type === 'ImportNamespaceSpecifier') {
            expectedExpressionCallee = {
                type: 'MemberExpression',
                object: specifier.local,
                property: {
                    type: 'Identifier',
                    name: 'defineMethod',
                }
            };
            break;
        }
    }
    
    if (!expectedExpressionCallee) {
        throw new Error('Could not find expected expression callee');
    }
    
    const defineMethodCalls = parser.getCallExpression(expectedExpressionCallee);
    
    const methodNames = defineMethodCalls.map((node) => {
        const name = node.arguments[0];
        if (!name) {
            return;
        }
        if (name.type !== 'Literal') {
            return;
        }
        return name.value;
    })
    
    return {
        AST: parser.AST,
        typeApiImport,
        defineMethodCalls,
        methodNames,
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
        throw new Error(`Could not find import for ${source}`);
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

function getImportSpecifier(node: ESTree.Node, specifier: {
    imported: ESTree.Identifier;
}) {
    if (node.type !== 'ImportSpecifier') {
        return;
    }
    if (node.imported.type !== 'Identifier') {
        return;
    }
    if (node.imported.name !== specifier.imported.name) {
        return;
    }
    if (node.local.type !== 'Identifier') {
        return;
    }
    return node;
}