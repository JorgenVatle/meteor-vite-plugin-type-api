import * as v from 'valibot';

export function defineMethod<
    TName extends string,
    TResult,
    TSchemaInput,
    TSchemaTOutput,
    TDefinition extends MethodDeclaration<TSchemaInput, TSchemaTOutput, TResult> = MethodDeclaration<TSchemaInput, TSchemaTOutput, TResult>
>(name: TName, definition: TDefinition): DefinedMethod<TDefinition> {
    if (import.meta.env.SSR) {
        Meteor.methods({
            [name]: (params: TSchemaInput) => {
                const schemaOutput = v.parse(definition.schema, params);
                return definition.method(schemaOutput);
            }
        });
    }
    
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
    schema: v.GenericSchema<TSchemaInput, TSchemaTOutput>;
    method: (params: TSchemaTOutput) => TResult
}

type DefinedMethod<
    TDeclaration
> = TDeclaration extends MethodDeclaration<infer TInput, any, infer TResult>
    ? (params: TInput) => TResult
    : never;