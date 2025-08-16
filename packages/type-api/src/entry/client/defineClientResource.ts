/// <reference types="meteor" />
import { ResourceDefinition, type ResourceDefinitionConfig } from '@/lib/ResourceDefinition';

export function defineMethod(config: ResourceDefinitionConfig) {
    const resource = new ResourceDefinition('method', config);
    
    // Todo: use stub if available
    // Meteor.methods({
    //     [resource.name]: resource.requestHandle(),
    // });
    
    return resource.callHandle(
        async (...params) => {
            return new Promise((resolve, reject) => {
                Meteor.call(resource.name, ...params, (err: null | Error, response: unknown) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(response);
                })
            })
        }
    );
}

export function definePublication(config: ResourceDefinitionConfig) {
    const resource = new ResourceDefinition('publication', config);
    
    return resource.callHandle((...params) => {
        return Meteor.subscribe(resource.name, ...params)
    });
}