import type { TargetEnvironment } from '@/lib/Environments';
import type * as v from 'valibot';

export interface ResourceConfig<
    TResult = unknown,
    TSchemaInput = unknown,
    TSchemaOutput = unknown,
> {
    name?: string;
    schema: v.GenericSchema<TSchemaInput, TSchemaOutput>,
    run: (params: TSchemaOutput) => TResult,
}

export interface InternalResourceConfig<
    TResult = unknown
> extends ResourceConfig<TResult> {
    _defaultName: string;
    _environment: TargetEnvironment;
}

export type ResourceHandle<
    TResult = unknown,
    TSchemaInput = unknown,
> = {
    /**
     * Sends request to the method/publication
     * @param params Publication or method params
     */
    (params: TSchemaInput): TResult;
    
    /**
     * Subscribes to or calls the current API resource.
     * @param params Resource params
     */
    run: (params: TSchemaInput) => TResult;
    
    /**
     * Name of the method/publication as defined with Meteor.
     */
    name: string;
}