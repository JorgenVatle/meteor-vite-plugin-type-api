/// <reference types="meteor" />
import { resourceLabel } from '@/lib/Environments';
import type { InternalResourceConfig } from '@/lib/ResourceConfig';
import { createCallHandle, createRequestHandle } from '@/lib/ResourceHandle';

export function defineMethod(config: InternalResourceConfig) {
    const name = config.name || config._defaultName;
    const label = resourceLabel('method', config);
    
    console.debug(`${label} Defined`);
    
    Meteor.methods({
        [name]: createRequestHandle({
            config,
            type: 'method',
        }),
    });
    
    return createCallHandle({
        config,
        type: 'method',
    }, (...params) => Meteor.callAsync(name, ...params));
}

export function definePublication(config: InternalResourceConfig<Mongo.Cursor<any>>) {
    const name = config.name || config._defaultName;
    const label = resourceLabel('publication', config);
    
    console.debug(`${label} Defined`);
    
    Meteor.publish(name, createRequestHandle({
        config,
        type: 'publication',
    }));
    
    return createCallHandle({
        config,
        type: 'publication',
    }, () => {
        throw new Error('This method can only be called on the client')
    });
}