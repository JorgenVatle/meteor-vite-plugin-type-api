import * as Path from 'node:path';
import { mergeConfig, type PluginOption } from 'vite';
import type { RequiredDeep } from '../lib/UtilityTypes';

const PLUGIN_DEFAULTS = {
    dirname: {
        methods: 'methods',
        publications: 'publications',
    },
    fileExtension: {
        methods: '.methods.ts',
        publications: '.publications.ts',
    },
} satisfies MergedPluginConfiguration;

function virtualModuleId(type: 'methods' | 'publications', name: string) {
    console.debug(`Virtualized ${type} module: ${name}`)
    return `virtual:@meteor-vite/typed-api/${type}/${name}`
}

export default function meteorApiTypePlugin(userConfig: PluginConfiguration): PluginOption {
    const config = mergeConfig(PLUGIN_DEFAULTS, userConfig) as MergedPluginConfiguration;
    
    return [{
        name: '@meteor-vite/typed-api: methods',
        resolveId(id) {
            const { dir, ext, base } = Path.parse(id);
            if (config.fileExtension.methods === `.${ext}`) {
                return virtualModuleId('methods', base);
            }
            if (dir.endsWith(config.dirname.methods)) {
                return virtualModuleId('methods', Path.basename(dir));
            }
        }
    }];
}

export interface PluginConfiguration {
    /**
     * Treats all modules within the provided dirname as Meteor methods/publications.
     */
    dirname?: {
        /**
         * Parent directory for Meteor methods.
         *
         * All files within directories matching this name will be treated as
         * Meteor methods regardless of their file extension.
         *
         * @default methods
         */
        methods?: string;
        
        /**
         * Parent directory for Meteor publications.
         *
         * All files within directories matching this name will be treated as
         * Meteor publications regardless of their file extension.
         *
         * @default publications
         */
        publications?: string;
    },
    
    /**
     * Treats the provided file extensions as Meteor methods/publications.
     */
    fileExtension?: {
        /**
         * File extension for Meteor methods.
         *
         * This can be used as an alternative to nesting methods under a
         * methods directory.
         *
         * @default .methods.ts
         */
        methods?: string;
        
        /**
         * File extension for Meteor publications.
         *
         * This can be used as an alternative to nesting publications under a
         * publications directory.
         *
         * @default .publications.ts
         */
        publications?: string;
    }
}

type MergedPluginConfiguration = RequiredDeep<PluginConfiguration>;