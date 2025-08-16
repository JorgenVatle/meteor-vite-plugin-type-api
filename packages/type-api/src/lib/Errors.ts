export class ApiTypeError extends Error {}

export class ApiNotCompiled extends ApiTypeError {}

export class ClientOnly extends ApiTypeError {}

export class ApiTransformError extends ApiTypeError {}

export class InvalidApiDefinition extends ApiTypeError {}