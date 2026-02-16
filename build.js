const esbuild = require('esbuild');

async function build () {
    await esbuild.build({
        entryPoints: ['src/index.ts'],
        bundle: true,
        platform: 'node',
        target: 'node14',
        format: 'cjs',
        minify: true,
        outfile: 'dist/index.js',
        banner: {
            js: '#!/usr/bin/env node',
        },
    });
}

build().catch(() => {
    process.exit(1);
})
