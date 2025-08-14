import * as v from 'valibot';
import { ApiNotCompiled } from '../lib/Errors/ApiNotCompiled';
import { defineResourceHandle, getContext } from '../lib/ResourceHandle';

export function defineMethod<
    TName extends string,
    TResult,
    TSchemaInput,
    TSchemaTOutput,
>(name: TName, definition: MethodDeclaration<TSchemaInput, TSchemaTOutput, TResult>) {
    return defineResourceHandle({
        name,
        context: getContext(),
        type: 'method',
        schema: definition.schema,
        run: (...params: [TSchemaInput]): Promise<TResult> => {
            return new Promise<TResult>((resolve, reject) => {
                Meteor.call(name, ...params, (error: unknown, response: TResult) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(response);
                })
            })
        },
        register: (handle) => {
            Meteor.methods({ [name]: handle });
        }
    });
}

interface MethodDeclaration<
    TSchemaInput = unknown,
    TSchemaTOutput = unknown,
    TResult = unknown
> {
    schema: v.GenericSchema<TSchemaInput, TSchemaTOutput>;
    method: (params: TSchemaTOutput) => TResult | Promise<TResult>
}

type DefinedMethod<
    TDeclaration
> = TDeclaration extends MethodDeclaration<infer TInput, any, infer TResult>
    ? (params: TInput) => TResult
    : never;