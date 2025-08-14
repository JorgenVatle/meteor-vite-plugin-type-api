import type { GenericSchema } from 'valibot';

export function defineMethod<
    TName extends string,
    TResult,
    TSchemaInput,
    TSchemaTOutput,
>(name: TName, definition: MethodDeclaration<TSchemaInput, TSchemaTOutput, TResult>) {
    // todo
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