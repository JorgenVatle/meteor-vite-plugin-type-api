import type * as v from 'valibot';

export class ResourceDefinition implements ResourceDefinitionConfig {
    public readonly type: ResourceType;
    public readonly environment: ResourceEnvironment;
    public readonly name: string;
    public readonly schema: v.GenericSchema;
    public readonly run: ResourceDefinitionConfig['run'];
    
    constructor(config: ResourceDefinitionConfig) {
        this.type = config.type;
        this.environment = config.environment;
        this.name = config.name;
        this.schema = config.schema;
        this.run = config.run;
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