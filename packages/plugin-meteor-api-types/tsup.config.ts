import { defineConfig, type Options } from 'tsup';

function buildConfig(options: BuildConfigOptions): Options {
    const BASE_OPTIONS = {
        name: options.platform.toUpperCase(),
        entry: ['./src/index.ts'],
        format: ['esm', 'cjs'],
        outDir: `dist/${options.platform}`,
        skipNodeModulesBundle: true,
        dts: true,
        clean: true,
        define: {
            Meteor: 'Meteor',
            __IS_SERVER__: JSON.stringify(options.platform === 'node'),
        }
    } satisfies Options;
    
    Object.assign(BASE_OPTIONS.define, options.define);
    return Object.assign(BASE_OPTIONS, options);
}

type BuildConfigOptions = Omit<Options, 'platform'> & {
    platform: Extract<Options['platform'], string>;
};

export default defineConfig([
    buildConfig({
        platform: 'node',
    }),
    buildConfig({
        platform: 'browser',
        treeshake: 'smallest',
    }),
])