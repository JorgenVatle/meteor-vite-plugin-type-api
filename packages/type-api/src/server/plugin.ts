import { type Plugin } from 'vite';

export function meteorApiTypesPlugin(config?: PluginConfiguration): Plugin {
    return {
        name: 'meteor-vite: meteor-api-types',
    }
}

export interface PluginConfiguration {

}