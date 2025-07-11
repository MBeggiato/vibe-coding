import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'
  
  if (isLib) {
    // Library build configuration
    return {
      plugins: [
        react(),
        visualizer({
          filename: 'dist/bundle-analysis.html',
          open: false,
          gzipSize: true,
          brotliSize: true
        })
      ],
      build: {
        lib: {
          entry: resolve(process.cwd(), 'src/index.ts'),
          name: 'InteractiveCode',
          fileName: 'index',
          formats: ['es']
        },
        rollupOptions: {
          external: ['react', 'react-dom', 'react/jsx-runtime'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM'
            }
          }
        },
        minify: 'esbuild',
        sourcemap: true,
        cssCodeSplit: false
      },
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    }
  }
  
  // Development configuration
  return {
    plugins: [react()],
  }
})
