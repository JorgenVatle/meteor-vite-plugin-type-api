/// <reference types="meteor" />
import { ClientOnly } from '@/lib/Errors';
import { ResourceDefinition, type ResourceDefinitionConfig } from '@/lib/ResourceDefinition';

export function defineMethod(config: ResourceDefinitionConfig) {
    const resource = new ResourceDefinition('method', config);
    
    resource.log('debug', 'Defined');
    
    Meteor.methods({
        [resource.name]: resource.requestHandle(),
    });
    
    return resource.callHandle(
        (...params) => Meteor.callAsync(resource.name, ...params)
    );
}

export function definePublication(config: ResourceDefinitionConfig) {
    const resource = new ResourceDefinition('method', config);
    
    resource.log('debug', 'Defined');
    
    Meteor.publish(resource.name, resource.requestHandle());
    
    return resource.callHandle(() => {
        throw new ClientOnly('This method can only be called on the client')
    });
}