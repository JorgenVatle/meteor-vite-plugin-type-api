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
        outDir: `dist/${options.name}`,
        define: {
            __IS_SERVER__: JSON.stringify(options.platform === 'node'),
        },
    } satisfies Options;
    
    const result = Object.assign({}, BASE_OPTIONS, options, overrides, {
        define: Object.assign(BASE_OPTIONS.define, options.define, overrides.define),
    });
    
    console.debug(`Building ${options.platform}:${options.name}...`, result);
    
    return result;
    
}

export default defineConfig([
    buildConfig({
        name: 'entry',
        platform: 'neutral',
        entry: ['./src/entry/index.ts'],
    }),
    buildConfig({
        name: 'server',
        platform: 'node',
        entry: ['./src/server/index.ts'],
        dts: false,
    }),
    buildConfig({
        name: 'client',
        platform: 'browser',
        treeshake: 'smallest',
        entry: ['./src/client/index.ts'],
        dts: false,
    }),
    buildConfig({
        name: 'plugin',
        platform: 'node',
        entry: ['./src/plugin/index.ts'],
    })
])

interface BuildConfigBaseOptions {
    name: string;
    platform: Extract<Options['platform'], string>;
    entry: Exclude<Options['entry'], undefined>
}

interface BuildConfigOptions extends BuildConfigBaseOptions, Omit<Options, keyof BuildConfigBaseOptions> {}
