import { ModuleParser } from './ModuleParser';

export function transformMethod(code: string) {
    const parser = new ModuleParser(code);
    
    const typeApiImport = parser.getImport('@meteor-vite/type-api');
    const defineMethodCalls = parser.getImportedMethodCalls(typeApiImport, {
        type: 'Identifier',
        name: 'defineMethod',
    });
    
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

