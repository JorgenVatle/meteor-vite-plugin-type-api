import * as v from 'valibot';
import { ApiNotCompiled } from './Errors/ApiNotCompiled';

export type ResourceHandle<
    TInputParams extends any[] = [],
    TOutputParams extends any[] = [],
    TResult = unknown
> = {
    type: 'method' | 'publication';
    context: 'client' | 'server';
    schema: v.GenericSchema<TOutputParams, TOutputParams>;
    name: string;
    call: (...params: TInputParams) => TResult;
    handle: (...params: TOutputParams) => TResult;
};

export function getLabel(handle: ResourceHandle): string {
    return `[${handle.context} ${handle.type}] ${handle.name}`;
}

export function getContext() {
    return __IS_SERVER__ ? 'server' : 'client';
}

export function defineResourceHandle<
    TInputParams extends any[] = [],
    TOutputParams extends any[] = [],
    TResult = unknown
>(handle: ResourceHandle<TInputParams, TOutputParams, TResult>) {
    const label = getLabel(handle);
    
    if (!__IS_SERVER__) {
        throw new ApiNotCompiled(`Client Meteor API method has not been compiled yet! Make sure that the plugin is included in your Vite config and its named with a .methods.ts suffix or nested under a methods/ directory.`);
    }
    
    function wrappedHandle(this: any, params: TOutputParams): any {
        try {
            console.debug(`${label} Incoming request: `, params);
            const schemaOutput = v.parse(handle.schema, params);
            return handle.handle.apply(this, schemaOutput);
        } catch (error) {
            console.debug(`${label} Error: `, error);
            throw error;
        }
    }
    
    if (handle.type === 'method') {
        Meteor.methods({
            [handle.name]: wrappedHandle,
        });
    } else if (handle.type === 'publication') {
        Meteor.publish(handle.name, wrappedHandle);
    }
    
    console.debug(`${label} Defined resource handle`);
    return (async (...params: TInputParams): Promise<TResult> => {
        try {
            console.debug(`${label} Calling with params: `, params);
            if (handle.type === 'method') {
                const result = await new Promise<TResult>((resolve, reject) => {
                    Meteor.call(handle.name, ...params, (error: unknown, response: TResult) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(response);
                    });
                })
                console.debug(`${label} Response: `, result);
                return result;
            }
            
            return Meteor.subscribe(handle.name, ...params);
        } catch (error) {
            console.error(`${label} Error: `, error);
            throw error;
        }
    });
}