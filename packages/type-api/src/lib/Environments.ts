import { InvalidEnvironment } from '@/lib/Errors';

export const SUPPORTED_ENVIRONMENTS = [
    'server',
    'client',
] as const;

type SupportedEnvironment = (typeof SUPPORTED_ENVIRONMENTS)[number];

export type TargetEnvironment = SupportedEnvironment | ({} & string);

export function isSupportedEnvironment(target: TargetEnvironment) {
    return SUPPORTED_ENVIRONMENTS.some(name => name === target);
}

export const ENTRY_MODULE: Record<TargetEnvironment, string> = {
    main: '@meteor-vite/type-api',
    server: '@meteor-vite/type-api/server',
    client: '@meteor-vite/type-api/client',
}

export function getEntryModule(environment: TargetEnvironment) {
    if (environment in ENTRY_MODULE) {
        return ENTRY_MODULE[environment]
    }
    throw new InvalidEnvironment(`Unable to determine entry module for environment: ${environment}`);
}