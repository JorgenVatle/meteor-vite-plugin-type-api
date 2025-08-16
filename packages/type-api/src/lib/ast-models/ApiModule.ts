import { ResourceDefinition } from '@/lib/ast-models/ResourceDefinition';
import { ENTRY_MODULE, getEntryModule, isSupportedEnvironment, type TargetEnvironment } from '@/lib/Environments';
import { generate } from 'escodegen';
import type ESTree from 'estree';
import { type NodePath, traverse } from 'estree-toolkit';
import Path from 'node:path';
import { parseAst } from 'rollup/parseAst';

export class ApiModule {
    constructor(
        public readonly info: ParsedModuleInfo,
        public path?: NodePath<ESTree.Program>,
    ) {}
    
    public get performanceMode() {
        return this.info.source.performanceMode;
    }
    
    protected get resources() {
        return [
            this.info.publications,
            this.info.methods,
        ].flat()
    }
    
    public get namespace() {
        const { name } = Path.parse(this.info.source.filePath);
        return name.replace(/\.(methods|publications)/, '');
    }
    
    public static parse(source: ModuleSource) {
        const AST = parseAst(source.code);
        const methods: ResourceDefinition[] = [];
        const publications: ResourceDefinition[] = [];
        const module = new this({
            AST,
            publications,
            methods,
            source,
        })
        
        traverse(AST, {
            $: {
                scope: true,
            },
            CallExpression(path) {
                if (!path.node) {
                    return;
                }
                const callee = path.get('callee');
                if (!callee) {
                    return;
                }
                if (callee.node?.type !== 'Identifier') {
                    return;
                }
                if (callee.node.name === 'defineMethod') {
                    methods.push(new ResourceDefinition('defineMethod', path, module));
                }
                if (callee.node.name === 'definePublication') {
                    publications.push(new ResourceDefinition('definePublication', path, module));
                }
            },
            Program(path) {
                module.path = path;
            }
        })
        
        return module;
    }
    
    protected removeUnusedBindings() {
        const scope = this.path?.scope;
        if (!scope) {
            throw new Error('Missing scope!');
        }
        
        traverse(this.path?.node!, {
            $: { scope: true },
            Program: (path) => {
                this.path = path;
            }
        })
        
        for (const [name, binding] of Object.entries(scope.bindings)) {
            if (binding?.references.length) {
                continue; // Binding is in use
            }
            const removalTarget = binding?.path.find((path) => path.type === 'ImportDeclaration');
            if (!removalTarget) {
                continue; // Not an import
            }
            console.dir({ ['Removed import: ' + name]: removalTarget.node });
            removalTarget?.remove();
        }
        
    }
    
    public transform(target: TargetEnvironment) {
        console.debug(`Transforming module for environment: ${target}`);
        if (!isSupportedEnvironment(target)) {
            console.warn(new Error(`Environment is not supported for transformation: ${target}`))
        }
        this.resources.map((resource) => resource.transform(target));
        if (target === 'client') {
            this.removeUnusedBindings();
        }
        for (const node of this.path!.node!.body) {
            if (node.type !== 'ImportDeclaration') {
                continue;
            }
            const source = node.source;
            if (!source) {
                return;
            }
            if (source.value?.toString() === ENTRY_MODULE.main) {
                source.value = getEntryModule(target);
            }
        }
    }
    
    public get code() {
        return generate(this.info.AST);
    }
}

interface ParsedModuleInfo {
    AST: ESTree.Program;
    methods: ResourceDefinition[];
    publications: ResourceDefinition[];
    source: ModuleSource;
}

interface ModuleSource {
    filePath: string;
    code: string;
    performanceMode?: boolean;
}