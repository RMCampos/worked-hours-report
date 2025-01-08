import { ConfigEnv, defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

export default defineConfig(({ mode }: ConfigEnv) => {
  const config: UserConfig = {
    define: {},
    plugins: [react()],
    build: {
      outDir: 'dist',
      sourcemap: true
    },
    server: {
      port: 5000
    },
    preview: {
      port: 5000
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap')
      }
    }
  };

  if (mode === 'development') {
    if (config.define) {
      config.define.global = {};
    }
  }

  return config;
});
