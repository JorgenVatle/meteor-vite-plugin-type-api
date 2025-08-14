import { defineConfig } from 'tsup';

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
        define: {
            Meteor: 'Meteor',
            __IS_SERVER__: 'false',
        }
    }
])