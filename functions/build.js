// Custom build script for Firebase Functions
// Excludes seed-firestore and content files from the bundle
import esbuild from 'esbuild';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

esbuild.build({
    entryPoints: [join(__dirname, 'src/index.ts')],
    bundle: true,
    platform: 'node',
    target: 'node20',
    format: 'cjs',
    outfile: join(__dirname, 'lib/index.cjs'),
    external: [
        'firebase-functions',
        'firebase-admin',
        'express',
        'zod',
        'ws',
        'dotenv',
        // Exclude seed and content files
        '../../server/seed-firestore',
        '../../server/seed-firestore.ts',
        './server/seed-firestore',
        './server/seed-firestore.ts',
    ],
    // Mark dynamic imports as external if they match a pattern
    plugins: [{
        name: 'exclude-seed',
        setup(build) {
            // Intercept seed-firestore imports and make them external
            build.onResolve({ filter: /seed-firestore/ }, args => {
                return { path: args.path, external: true };
            });
        },
    }],
    logLevel: 'info',
}).catch((e) => {
    console.error('Build failed:', e);
    process.exit(1);
});
