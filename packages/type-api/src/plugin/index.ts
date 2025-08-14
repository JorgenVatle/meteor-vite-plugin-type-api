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
    return `virtual:@meteor-vite/typed-api/${type}/${name}`
}

export default function meteorApiTypePlugin(userConfig: PluginConfiguration): PluginOption {
    const config = mergeConfig(PLUGIN_DEFAULTS, userConfig) as MergedPluginConfiguration;
    
    return [{
        name: '@meteor-vite/typed-api: methods',
        transform(code, id) {
            const { dir, base } = Path.parse(id);
            let moduleId: string | undefined = undefined;
            if (base.endsWith(config.fileExtension.methods)) {
                moduleId = virtualModuleId('methods', base);
            }
            if (dir.endsWith(config.dirname.methods)) {
                moduleId = virtualModuleId('methods', Path.basename(dir));
            }
            if (!moduleId) {
                return;
            }
            if (id.includes('methods')) {
            }
            console.debug('[Resolved]', { id, moduleId, dir, base, ast: this.parse(code) });
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