import { type Plugin } from 'vite';

export default function meteorApiTypePlugin(config: PluginConfiguration): Plugin {
    return {
        name: 'meteor-vite: meteor-api-types',
    }
}

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