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
    run: (...params: TInputParams) => TResult;
    register: (handle: (...params: any) => TResult) => void;
};

export function getLabel(handle: Pick<ResourceHandle, 'context' | 'name' | 'type'>): string {
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
    
    console.debug(`${label} Defined resource handle`);
    
    function wrappedHandle(this: any, ...params: TOutputParams): any {
        try {
            console.debug(`${label} Incoming request: `, params);
            const schemaOutput = v.parse(handle.schema, params);
            return handle.run.apply(this, schemaOutput);
        } catch (error) {
            console.debug(`${label} Error: `, error);
            throw error;
        }
    }
    
    function wrappedCall(this: any, ...params: TInputParams): any {
        console.debug(`${label} Calling with params: `, params);
        const result = handle.run.apply(this, params);
        Promise.resolve(result).catch((error) => {
            console.error(`${label} Error: `, error);
        }).then(() => {
            console.debug(`${label} Response: `, result);
        });
        return result;
    }
    
    handle.register(wrappedHandle);
    
    return wrappedCall;
}