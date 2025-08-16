import type { ResourceConfig, ResourceHandle } from '@/lib/ResourceConfig';

export function defineMethod<
    TResult,
    TSchemaInput = unknown,
    TSchemaOutput = unknown,
>(config: ResourceConfig<TResult, TSchemaInput, TSchemaOutput>): ResourceHandle<Promise<TResult>, TSchemaInput> {
    throw new Error('Method has not been transformed by Meteor-Vite!');
}

export function definePublication<
    TResult,
    TSchemaInput = unknown,
    TSchemaOutput = unknown,
>(config: ResourceConfig<TResult, TSchemaInput, TSchemaOutput>): ResourceHandle<Meteor.SubscriptionHandle, TSchemaInput> {
    throw new Error('Publication has not been transformed by Meteor-Vite!');
}