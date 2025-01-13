import { exit } from 'process';
import { resolve, parse } from 'path';
import { defineConfig } from 'vite';
import { globSync } from 'glob';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import { copy } from './copy';

/**
 * List all entry should be exported
 */
const getEntries = (): Record<string, string> => {
  const list = globSync(resolve(__dirname, './src/components/**/*.vue'));
  const remaped: Record<string, string> = {};

  list.forEach((item) => {
    remaped[parse(item).name.toLowerCase()] = resolve(__dirname, item);
  });

  return {
    index: resolve(__dirname, './src/index.ts'),
    setup: resolve(__dirname, './src/setup.ts'),
    filters: resolve(__dirname, './src/filters.ts'),
    directives: resolve(__dirname, './src/directives.ts'),
    ...remaped,
  };
};

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    libInjectCss(),
    copy(['./src/scss'], '../scss'),
    dts({
      tsconfigPath: './tsconfig.build.json',
      outDir: './dist/types',
      cleanVueFileName: true,
      beforeWriteFile: (filePath: string, content: string) => {
        return {
          filePath: filePath.replace('dist/types/src', 'dist/types'),
          content,
        };
      },
      afterBuild: () => {
        setTimeout(() => exit(0), 300);
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  build: {
    outDir: 'dist/js',
    lib: {
      name: 'design-system',
      formats: ['es'],
      entry: getEntries(),
    },
    cssCodeSplit: true,
    copyPublicDir: false,
    rollupOptions: {
      external: ['vue', 'vue-router'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
        },
        preserveModules: false,
        chunkFileNames: 'chunks/[name].[hash].js',
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: (entry) => {
          return entry.facadeModuleId?.includes('src/components') ? 'components/[name].js' : '[name].js';
        },
      },
    },
  },
});
