import { defineConfig, type Options } from 'tsup';

function buildConfig(options: BuildConfigOptions): Options {
    const BASE_OPTIONS = {
        entry: ['./src/index.ts'],
        format: ['esm', 'cjs'],
        outDir: 'dist/node',
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
    platform: Extract<Options['platform'], string>
};

export default defineConfig([
    {
        entry: ['./src/index.ts'],
        format: ['esm', 'cjs'],
        outDir: 'dist/node',
        platform: 'node',
        skipNodeModulesBundle: true,
        dts: true,
        clean: true,
        define: {
            Meteor: 'Meteor',
            __IS_SERVER__: 'true',
        }
    },
    {
        entry: ['./src/index.ts'],
        outDir: 'dist/browser',
        clean: true,
        format: ['esm', 'cjs'],
        platform: 'browser',
        skipNodeModulesBundle: true,
        dts: true,
        treeshake: 'smallest',
        define: {
            Meteor: 'Meteor',
            __IS_SERVER__: 'false',
        }
    }
])