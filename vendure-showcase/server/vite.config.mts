import { vendureDashboardPlugin } from '@vendure/dashboard/vite';
import { dirname, join, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    base: '/dashboard/',
    build: {
        outDir: join(__dirname, 'dist', 'dashboard'),
    },
    plugins: [
        vendureDashboardPlugin({
            vendureConfigPath: pathToFileURL(resolve(__dirname, './src/vendure-config.ts')),
            // Der Server läuft als ESM ("type": "module", import.meta.url in der Config).
            // Ohne dies kompiliert der Config-Loader nach CommonJS und kollidiert mit der
            // `const __dirname = …`-Deklaration ("Identifier '__dirname' already declared").
            module: 'esm',
            api: {
                host: 'http://localhost',
                port: parseInt(process.env.PORT ?? '3000'),
            },
            gqlOutputPath: './src/gql',
        }),
    ],
    resolve: {
        alias: {
            '@/gql': resolve(__dirname, './src/gql/graphql.ts'),
        },
    },
});
