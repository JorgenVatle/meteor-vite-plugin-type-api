/// <reference types="meteor" />
import { resourceLabel } from '@/lib/Environments';
import type { InternalResourceConfig } from '@/lib/ResourceConfig';
import { createCallHandle } from '@/lib/ResourceHandle';

export function defineMethod(config: InternalResourceConfig) {
    const name = config.name || config._defaultName;
    const label = resourceLabel('method', config);
    
    console.debug(`${label} Defined`);
    
    // Todo: use stub if available
    // Meteor.methods({
    //     [name]: createRequestHandle({
    //         config,
    //         type: 'method',
    //     }),
    // });
    
    return createCallHandle({
        config,
        type: 'method',
    }, async (...params) => {
        return new Promise((resolve, reject) => {
            Meteor.call(name, ...params, (err: null | Error, response: unknown) => {
                if (err) {
                    return reject(err);
                }
                resolve(response);
            })
        })
    });
}

export function definePublication(config: InternalResourceConfig<Mongo.Cursor<any>>) {
    const name = config.name || config._defaultName;
    const label = resourceLabel('publication', config);
    
    console.debug(`${label} Defined`);
    
    return createCallHandle({
        config,
        type: 'publication',
    }, (...params) => Meteor.subscribe(name, ...params));
}