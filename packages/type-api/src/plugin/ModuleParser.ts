import type ESTree from 'estree';
import { walk } from 'estree-walker';
import type { ProgramNode } from 'rollup';
import { parseAst } from 'rollup/parseAst';

export class ModuleParser {
    public readonly AST: ProgramNode;
    public readonly callExpressions: ESTree.CallExpression[] = [];
    
    constructor(public readonly code: string) {
        this.AST = parseAst(code);
        walk(this.AST, {
            enter: (node) => {
                if (node.type === 'CallExpression') {
                    this.callExpressions.push(node);
                }
            }
        })
    }
    
    public replaceImportedCallExpressions(config: {
        moduleId: '@meteor-vite/type-api',
        identifier: ESTree.Identifier,
        replacement: ESTree.Expression
    }) {
        const importDeclaration = this.getImport(config.moduleId);
        const callee = this.getImportedCallee(importDeclaration, config.identifier);
        const AST = parseAst(this.code);
        walk(AST, {
            enter(node) {
                const expression = getCallExpression(node, callee);
                if (!expression) {
                    return;
                }
                this.replace(config.replacement);
            }
        });
        return AST;
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
    
    public getCallExpression(callee: ESTree.Identifier | ParsedExpressionCallee) {
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
    
    public getImportedCallee(declaration: ESTree.ImportDeclaration, identifier: ESTree.Identifier): ParsedExpressionCallee {
        for (const specifier of declaration.specifiers) {
            const importSpecifier = getImportSpecifier(specifier, {
                imported: identifier,
            });
            
            if (importSpecifier) {
                return importSpecifier.local;
            }
            
            if (specifier.type === 'ImportDefaultSpecifier') {
                return {
                    type: 'MemberExpression',
                    object: specifier.local,
                    property: identifier
                };
            }
            
            if (specifier.type === 'ImportNamespaceSpecifier') {
                return {
                    type: 'MemberExpression',
                    object: specifier.local,
                    property: identifier,
                };
            }
        }
        
        throw new Error('Could not find expected expression callee');
    }
    
    public getImportedMethodCalls(declaration: ESTree.ImportDeclaration, identifier: ESTree.Identifier) {
        const callee = this.getImportedCallee(declaration, identifier);
        return this.getCallExpression(callee);
    }
}

type ParsedExpressionCallee = ESTree.Identifier | Pick<ESTree.MemberExpression, 'property' | 'type' | 'object'>;

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

function getCallExpression(node: ESTree.Node, callee: ParsedExpressionCallee) {
    if (node.type !== 'CallExpression') {
        return;
    }
    if (node.callee.type !== callee.type) {
        return;
    }
    if (callee.type === 'Identifier') {
        return node;
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
    return node;
}