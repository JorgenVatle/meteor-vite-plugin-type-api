import type { TargetEnvironment } from '@/lib/Environments';

export interface ResourceConfig<TResult = unknown, TParams extends any[] = any[], > {
    name?: string;
    run: (...params: TParams) => TResult
}

export interface InternalResourceConfig<TResult = unknown> extends ResourceConfig<TResult> {
    _defaultName: string;
    _environment: TargetEnvironment;
}

export type ResourceHandle<TResult = unknown, TParams extends any[] = any[]> = {
    /**
     * Sends request to the method/publication
     * @param params Publication or method params
     */
    (...params: TParams): TResult;
    
    /**
     * Subscribes to or calls the current API resource.
     * @param params Resource params
     */
    run: (...params: TParams) => TResult;
    
    /**
     * Name of the method/publication as defined with Meteor.
     */
    name: string;
}