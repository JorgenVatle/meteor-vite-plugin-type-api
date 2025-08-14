export type ResourceHandle<
    TParams extends any[] = [],
    TResult = unknown
> = {
    type: 'method' | 'publication';
    context: 'client' | 'server';
    name: string;
    run: (...params: TParams) => TResult;
};

function getLabel(handle: ResourceHandle) {
    return `[${handle.context} ${handle.type}] ${handle.name}`;
}

export function defineResourceHandle<
    TParams extends any[] = [],
    TResult = unknown
>(handle: ResourceHandle<TParams, TResult>) {
    const label = getLabel(handle);
    return ((...params: TParams): Promise<TResult> => {
        return new Promise<TResult>((resolve, reject) => {
            console.debug(`${label} Calling with params: `, params);
            Meteor.call(handle.name, params, (error: unknown, response: TResult) => {
                if (error) {
                    console.error(`${label} Error: `, error);
                    return reject(error);
                }
                resolve(response);
                console.debug(`${label} Response: `, response);
            });
        })
    });
}