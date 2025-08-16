import type { InternalResourceConfig } from '@/lib/ResourceConfig';

export const SUPPORTED_ENVIRONMENTS = [
    'server',
    'client',
] as const;

type SupportedEnvironment = (typeof SUPPORTED_ENVIRONMENTS)[number];

export type TargetEnvironment = SupportedEnvironment | ({} & string);

export function isSupportedEnvironment(target: TargetEnvironment) {
    return SUPPORTED_ENVIRONMENTS.some(name => name === target);
}

export type ResourceType = 'method' | 'publication';
export function resourceLabel(type: ResourceType, config: InternalResourceConfig): string {
    return `(${config._environment.toUpperCase()}) [${type}: ${config.name || config._defaultName}]`;
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
    throw new Error(`Unable to determine entry module for environment: ${environment}`);
}