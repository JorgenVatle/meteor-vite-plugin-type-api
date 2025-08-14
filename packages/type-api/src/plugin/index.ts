import { type Plugin } from 'vite';

export default function meteorApiTypePlugin(config?: PluginConfiguration): Plugin {
    return {
        name: 'meteor-vite: meteor-api-types',
    }
}

export interface PluginConfiguration {

}