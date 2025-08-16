import type { ResourceConfig, ResourceHandle } from '@/lib/ResourceConfig';

export function defineMethod<
    TParams extends any[],
    TResult
>(config: ResourceConfig<TResult, TParams>): ResourceHandle<Promise<TResult>, TParams> {
    throw new Error('Method has not been transformed by Meteor-Vite!');
}

export function definePublication<
    TParams extends any[],
    TResult
>(config: ResourceConfig<TResult, TParams>): ResourceHandle<Meteor.SubscriptionHandle, TParams> {
    throw new Error('Publication has not been transformed by Meteor-Vite!');
}