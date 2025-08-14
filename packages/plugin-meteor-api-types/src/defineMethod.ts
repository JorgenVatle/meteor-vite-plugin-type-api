import * as v from 'valibot';

export function defineMethod<
    TName extends string,
    TResult,
    TSchemaInput,
    TSchemaTOutput,
>(name: TName, definition: MethodDeclaration<TSchemaInput, TSchemaTOutput, TResult>) {
    const label = __IS_SERVER__ ? `[Server Method: ${name}]` : `[Client Method: ${name}]`;
    if (__IS_SERVER__) {
        Meteor.methods({
            [name]: (params: TSchemaInput) => {
                const schemaOutput = v.parse(definition.schema, params);
                return definition.method(schemaOutput);
            }
        });
    }
    
    console.debug(`${label} Defined`);
    
    return ((params: TSchemaInput): Promise<TResult> => {
        return new Promise<TResult>((resolve, reject) => {
            console.debug(`${label} Calling with params: `, params);
            Meteor.call(name, params, (error: unknown, response: TResult) => {
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