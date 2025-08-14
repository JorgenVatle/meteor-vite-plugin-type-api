import meteorApiTypes from '@meteor-vite/type-api/plugin';
import TailwindCSS from '@tailwindcss/vite';
import Vue from '@vitejs/plugin-vue';
import { meteor } from 'meteor-vite/plugin';
import VueRouter from 'unplugin-vue-router/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        meteor({
            clientEntry: 'client/entry-vite.ts',
            serverEntry: 'server/entry-vite.ts',
            enableExperimentalFeatures: true,
            stubValidation: {
                warnOnly: true,
            }
        }),
        meteorApiTypes(),
        VueRouter({
            routesFolder: ['imports/ui/pages']
        }),
        TailwindCSS(),
        Vue(),
    ]
})