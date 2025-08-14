import { mergeConfig, type Plugin } from 'vite';
import type { RequiredDeep } from '../lib/UtilityTypes';

export default function meteorApiTypePlugin(userConfig: PluginConfiguration): Plugin {
    const config = mergeConfig(PLUGIN_DEFAULTS, userConfig);
    return {
        name: 'meteor-vite: meteor-api-types',
    }
}

const PLUGIN_DEFAULTS = {
    methods: {
        dirname: 'methods',
        fileExtension: '.methods.ts',
    },
    publications: {
        dirname: 'publications',
        fileExtension: '.publications.ts',
    },
} satisfies MergedPluginConfiguration;

export interface PluginConfiguration {
    methods?: {
        /**
         * Parent directory for Meteor methods.
         *
         * All files within directories matching this name will be treated as
         * Meteor methods regardless of their file extension.
         *
         * @default methods
         */
        dirname?: string;
        
        /**
         * File extension for Meteor methods.
         *
         * This can be used as an alternative to nesting methods under a
         * methods directory.
         *
         * @default .methods.ts
         */
        fileExtension?: string;
    },
    
    publications?: {
        /**
         * Parent directory for Meteor publications.
         *
         * All files within directories matching this name will be treated as
         * Meteor publications regardless of their file extension.
         *
         * @default publications
         */
        dirname?: string;
        
        /**
         * File extension for Meteor publications.
         *
         * This can be used as an alternative to nesting publications under a
         * publications directory.
         *
         * @default .publications.ts
         */
        fileExtension?: string;
    }
}

type MergedPluginConfiguration = RequiredDeep<PluginConfiguration>;