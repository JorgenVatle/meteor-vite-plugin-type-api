import type { ApiModule } from '@/lib/ast-models/ApiModule';
import { ObjectExpressionModel } from '@/lib/ast-models/ObjectExpressionModel';
import type { TargetEnvironment } from '@/lib/Environments';
import { ApiTransformError, InvalidApiDefinition } from '@/lib/Errors';
import { generate } from 'escodegen';
import type ESTree from 'estree';
import { type NodePath, utils } from 'estree-toolkit';

export class ResourceDefinition {
    protected readonly config: ObjectExpressionModel;
    protected transformedFor?: TargetEnvironment;
    
    public static readonly CLIENT_CONFIG_KEY_WHITELIST = [
        'name',
        'stub', // Method stub code for client-side eager evaluation
        '_defaultName', // Method name generated based on filepath. Overriden by name
        '_environment',
    ]
    
    constructor(
        public readonly type: 'defineMethod' | 'definePublication',
        protected readonly path: NodePath<ESTree.CallExpression>,
        protected readonly module: ApiModule,
    ) {
        const [config] = path.get('arguments');
        if (!config) {
            throw new InvalidApiDefinition(`Invalid use of ${this.type}, you need to specify its config!`);
        }
        if (config.type !== 'ObjectExpression') {
            throw new InvalidApiDefinition(`${this.type} expects an object`)
        }
        this.config = new ObjectExpressionModel(config);
        
        if (this.module.performanceMode) {
            this.path.skipChildren();
        }
    }
    
    public get name() {
        const prop = this.config.getProperty('name');
        const value = prop?.get('value');
        if (!prop || !value) {
            return;
        }
        const propEval = utils.evaluate(prop.get('value')) || { value: null };
        console.dir(
            { node: value?.node, propEval }
        );
        return propEval.value;
    }
    
    public get defaultName() {
        const exportDeclaration = this.path.findParent<ESTree.VariableDeclarator>(path => path.type === 'VariableDeclarator');
        if (!exportDeclaration) {
            throw new ApiTransformError(`Could not generate name for ${this.type} as it is not assigned to any variable.`)
        }
        
        const id = exportDeclaration.get('id');
        if (id.node?.type !== 'Identifier') {
            throw new ApiTransformError(`Could not locate identifier for ${this.type}!`);
        }
        return [
            this.module.namespace,
            id.node.name,
        ].join('.');
    }
    
    public transform(targetEnvironment: TargetEnvironment) {
        if (this.transformedFor) {
            if (this.transformedFor !== targetEnvironment) {
                throw new ApiTransformError(`Tried pre-transformed module to a different environment: ${targetEnvironment}`)
            }
            console.warn(new ApiTransformError('Tried to transform resource twice'));
        } else {
            this.config.addProperty({
                key: '_defaultName',
                value: this.defaultName,
            });
            this.config.addProperty({
                key: '_environment',
                value: targetEnvironment,
            })
        }
        
        this.transformedFor = targetEnvironment;
        if (targetEnvironment === 'server') {
            return;
        }
        
        this.path.traverse({
            Property(path) {
                const key = path.get('key');
                if (key.node?.type !== 'Identifier') {
                    return;
                }
                if (ResourceDefinition.CLIENT_CONFIG_KEY_WHITELIST.includes(key.node.name)) {
                    return;
                }
                path.remove();
            }
        })
    }
    
    public get code() {
        return generate(this.path.node);
    }
    
}