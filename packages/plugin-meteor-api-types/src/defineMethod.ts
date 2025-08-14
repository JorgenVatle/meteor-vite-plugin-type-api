/// <reference types="meteor">
import type { GenericSchema } from 'valibot';

export function defineMethod<
    TName extends string,
    TResult,
    TSchemaInput,
    TSchemaTOutput,
    TDefinition extends MethodDeclaration<TSchemaInput, TSchemaTOutput, TResult> = MethodDeclaration<TSchemaInput, TSchemaTOutput, TResult>
>(name: TName, definition: TDefinition): DefinedMethod<TDefinition> {
    return ((params: TSchemaInput) => {
        return new Promise((resolve, reject) => {
            Meteor.call(name, params, (error: unknown, response: TResult) => {
                if (error) {
                    return reject(error);
                }
                resolve(response);
            });
        })
    }) as DefinedMethod<TDefinition>
}

interface MethodDeclaration<
    TSchemaInput = unknown,
    TSchemaTOutput = unknown,
    TResult = unknown
> {
    schema: GenericSchema<TSchemaInput, TSchemaTOutput>;
    method: (params: TSchemaTOutput) => TResult
}

type DefinedMethod<
    TDeclaration
> = TDeclaration extends MethodDeclaration<infer TInput, any, infer TResult>
    ? (params: TInput) => TResult
    : never;