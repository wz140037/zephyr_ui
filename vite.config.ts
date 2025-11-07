import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import libCss from 'vite-plugin-libcss'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    libCss(),
    dts({
      entryRoot: './packages',
      outDir: 'dist/types',
      include: ['packages/**/*'],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'packages/index.ts'),
      name: 'ZephyrUI',
      fileName: (format) => `zephyr-ui.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: [
        'vue',
        'monaco-editor-core',
        'shiki',
        '@shikijs/monaco'
      ],
      output: {
        globals: {
          vue: 'Vue',
        }
      }
    },
    cssCodeSplit: true,
  }
})
