/// <reference types="meteor" />
import { ClientOnly } from '@/lib/Errors';
import { ResourceDefinition, type ResourceDefinitionConfig } from '@/lib/ResourceDefinition';

export function defineMethod(config: ResourceDefinitionConfig) {
    const resource = new ResourceDefinition('method', config);
    
    Meteor.methods({
        [resource.name]: resource.requestHandle(),
    });
    
    return resource.callHandle(
        (...params) => Meteor.callAsync(resource.name, ...params)
    );
}

export function definePublication(config: ResourceDefinitionConfig) {
    const resource = new ResourceDefinition('method', config);
    
    Meteor.publish(resource.name, resource.requestHandle());
    
    return resource.callHandle(() => {
        throw new ClientOnly('This method can only be called on the client')
    });
}