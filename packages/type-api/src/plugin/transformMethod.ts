import { ModuleParser } from './ModuleParser';

export function transformMethod(code: string) {
    const parser = new ModuleParser(code);
    
    const typeApiImport = parser.getImport('@meteor-vite/type-api');
    const methodCalls = parser.getImportedMethodCalls(typeApiImport, {
        type: 'Identifier',
        name: 'defineMethod',
    });
    
    const methodNames = methodCalls.map((node) => {
        const name = node.arguments[0];
        if (!name) {
            return;
        }
        if (name.type !== 'ObjectExpression') {
            return;
        }
        for (const property of name.properties) {
            if (property.type !== 'Property') {
                continue;
            }
            if (property.key.type !== 'Identifier') {
                continue;
            }
            if (property.key.name !== 'name') {
                continue;
            }
            if (property.value.type !== 'Literal') {
                continue;
            }
            
            return property.value.value;
        }
        throw new Error('Unable to find method name in defineMethod call expression');
    })
    
    return {
        AST: parser.AST,
        typeApiImport,
        methodCalls,
        methodNames,
        parser,
    };
}

