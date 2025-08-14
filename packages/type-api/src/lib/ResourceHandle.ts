export type ResourceHandle<
    TParams extends any[] = [],
    TResult = unknown
> = {
    type: 'method' | 'publication';
    context: 'client' | 'server';
    name: string;
    run: (...params: TParams) => TResult;
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
    console.debug(`${label} Defined resouce handle`);
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