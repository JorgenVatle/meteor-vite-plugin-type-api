import * as v from 'valibot';
import { ApiNotCompiled } from '../lib/Errors/ApiNotCompiled';

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
                try {
                    console.debug(`${label} Incoming request: `, params);
                    const schemaOutput = v.parse(definition.schema, params);
                    return definition.method(schemaOutput);
                } catch (error) {
                    console.debug(`${label} Error: `, error);
                    throw error;
                }
            }
        });
    } else {
        throw new ApiNotCompiled(`Client Meteor API method has not been compiled yet! Make sure that the plugin is included in your Vite config and its named with a .methods.ts suffix or nested under a methods/ directory.`);
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