import { ApiNotCompiled } from './Errors/ApiNotCompiled';

export type ResourceHandle<
    TParams extends any[] = [],
    TResult = unknown
> = {
    type: 'method' | 'publication';
    context: 'client' | 'server';
    name: string;
    run: (...params: TParams) => TResult;
    register: (label: string) => void;
};

export function getLabel(handle: ResourceHandle) {
    return `[${handle.context} ${handle.type}] ${handle.name}`;
}

export function getContext() {
    return __IS_SERVER__ ? 'server' : 'client';
}

export function defineResourceHandle<
    TParams extends any[] = [],
    TResult = unknown
>(handle: ResourceHandle<TParams, TResult>) {
    const label = getLabel(handle);
    
    if (__IS_SERVER__) {
        handle.register(label);
    } else {
        throw new ApiNotCompiled(`Client Meteor API method has not been compiled yet! Make sure that the plugin is included in your Vite config and its named with a .methods.ts suffix or nested under a methods/ directory.`);
    }
    
    console.debug(`${label} Defined resource handle`);
    return (async (...params: TParams): Promise<TResult> => {
        try {
            console.debug(`${label} Calling with params: `, params);
            const result = await handle.run(...params);
            console.debug(`${label} Response: `, result);
            return result;
        } catch (error) {
            console.error(`${label} Error: `, error);
            throw error;
        }
    });
}