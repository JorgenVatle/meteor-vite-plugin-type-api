import { defineConfig, type Options } from 'tsup';

function buildConfig(options: BuildConfigOptions): Options {
    const BASE_OPTIONS = {
        format: ['esm', 'cjs'],
        skipNodeModulesBundle: true,
        dts: true,
        clean: true,
        define: {
            Meteor: 'Meteor',
        }
    } satisfies Options;
    
    const overrides = {
        name: `${options.platform.toUpperCase()}: ${options.name}`,
        outDir: `dist/${options.platform}`,
        define: {
            __IS_SERVER__: JSON.stringify(options.platform === 'node'),
        },
    } satisfies Options;
    
    return Object.assign({}, options, overrides, {
        define: Object.assign(BASE_OPTIONS.define, options.define, overrides.define),
    });
}

export default defineConfig([
    buildConfig({
        name: 'index',
        platform: 'node',
    }),
    buildConfig({
        name: 'index',
        platform: 'browser',
        treeshake: 'smallest',
    }),
])

interface BuildConfigBaseOptions {
    name: string;
    platform: Extract<Options['platform'], string>;
}

interface BuildConfigOptions extends BuildConfigBaseOptions, Omit<Options, keyof BuildConfigBaseOptions> {}
