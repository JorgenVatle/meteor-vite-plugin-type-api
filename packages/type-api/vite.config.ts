import Path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    resolve: {
        alias: [
            { find: '@/test', replacement: Path.join(import.meta.dirname, 'test') },
            { find: '@', replacement: Path.join(import.meta.dirname, 'src') },
        ]
    }
})