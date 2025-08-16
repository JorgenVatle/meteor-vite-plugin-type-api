import { resourceLabel, type ResourceType } from '@/lib/Environments';
import type { InternalResourceConfig } from '@/lib/ResourceConfig';

type ApiResource<T = unknown> = {
    type: ResourceType;
    config: InternalResourceConfig<T>;
}

export function createRequestHandle<T>(api: ApiResource<T>) {
    return async function (this: any, ...params: any) {
        const label = resourceLabel(api.type, api.config);
        console.debug(label, 'Received request', { params });
        const result = await api.config.run.apply(this, params);
        console.debug(label, 'Response', result);
        return result;
    }
}

export function createCallHandle(api: ApiResource, run: (...params: any) => any) {
    const handle = function (this: any, ...params: any) {
        const label = resourceLabel(api.type, api.config);
        console.debug(label, 'Sending request', { params });
        const result = run.apply(this, params);
        Promise.resolve(result).then(result => {
            console.debug(label, 'Received response', result);
        })
        return result;
    };
    
    Object.defineProperty(handle, 'name', {
        value: api.config.name || api.config._defaultName,
    });
    
    Object.assign(handle, {
        type: api.type,
        environment: api.config._environment,
        run: (...params: any) => handle(...params),
    });
    
    return handle;
}