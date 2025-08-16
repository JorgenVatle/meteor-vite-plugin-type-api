import * as v from 'valibot';

export class ResourceDefinition implements ResourceDefinitionConfig {
    
    constructor(protected readonly config: ResourceDefinitionConfig) {}
    
    public get type() {
        return this.config.type;
    }
    
    public get name() {
        return this.config.name;
    }
    
    public get schema() {
        return this.config.schema;
    }
    
    public get environment() {
        return this.config.environment;
    }
    
    public async run(params: any) {
        const parsed = v.parse(this.schema, params);
        return await this.config.run(parsed);
    }
}

interface ResourceDefinitionConfig {
    name: string;
    type: ResourceType;
    schema: v.GenericSchema;
    environment: ResourceEnvironment;
    run: (...params: any) => any;
}

export type ResourceType = 'method' | 'publication';
export type ResourceEnvironment = 'client' | 'server';