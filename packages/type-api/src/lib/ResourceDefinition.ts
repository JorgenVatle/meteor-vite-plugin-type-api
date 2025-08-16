export class ResourceDefinition {
    public readonly type: ResourceType;
    public readonly environment: ResourceEnvironment;
    constructor(config: ResourceDefinitionConfig) {
        this.type = config.type;
        this.environment = config.environment;
    }
}

interface ResourceDefinitionConfig {
    type: ResourceType;
    environment: ResourceEnvironment;
}

export type ResourceType = 'method' | 'publication';
export type ResourceEnvironment = 'client' | 'server';