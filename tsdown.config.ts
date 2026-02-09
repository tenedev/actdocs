import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: [{ cli: 'src/index.ts' }],
    minify: true,
    outExtensions: () => ({ js: '.js' }),
  },
]);
