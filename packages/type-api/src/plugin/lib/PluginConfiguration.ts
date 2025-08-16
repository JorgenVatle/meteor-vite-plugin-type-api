import type { RequiredDeep } from '@/lib/UtilityTypes';

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

export type MergedPluginConfiguration = RequiredDeep<PluginConfiguration>;