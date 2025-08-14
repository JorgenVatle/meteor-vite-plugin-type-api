import * as v from 'valibot';

export function defineMethod<
    TName extends string,
    TResult,
    TSchemaInput,
    TSchemaTOutput,
>(name: TName, definition: MethodDeclaration<TSchemaInput, TSchemaTOutput, TResult>) {
    if (__IS_SERVER__) {
        console.debug(`[Server] Defined method: ${name}`);
        Meteor.methods({
            [name]: (params: TSchemaInput) => {
                const schemaOutput = v.parse(definition.schema, params);
                return definition.method(schemaOutput);
            }
        });
    } else {
        console.debug('[Client] Defined method')
    }
    
    return ((params: TSchemaInput): Promise<TResult> => {
        return new Promise<TResult>((resolve, reject) => {
            Meteor.call(name, params, (error: unknown, response: TResult) => {
                if (error) {
                    return reject(error);
                }
                resolve(response);
            });
        })
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