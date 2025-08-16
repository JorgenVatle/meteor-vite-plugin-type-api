import { ApiModule } from '@/lib/ast-models/ApiModule';
import Path from 'node:path';
import { mergeConfig, type PluginOption } from 'vite';
import type { MergedPluginConfiguration, PluginConfiguration } from './lib/PluginConfiguration';

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

function virtualModuleId(scope: 'methods' | 'publications', id: string) {
    return `virtual:@meteor-vite/api/${scope}/${id}`;
}

export function TransformerPlugin(userConfig: PluginConfiguration = {}): PluginOption {
    const config = mergeConfig(PLUGIN_DEFAULTS, userConfig) as MergedPluginConfiguration;
    
    return {
        name: '@meteor-vite/typed-api: transformer',
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
            const module = ApiModule.parse({
                filePath: id,
                code,
                // performanceMode: true, Todo: props arent getting traversed correctly with this on
            });
            module.transform(this.environment.name);
            console.debug('[Resolved]', { id, moduleId, dir, base, module, code: module.code });
            return {
                code: module.code,
                id,
            }
        }
    }
}