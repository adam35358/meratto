import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { handleApiRequest } from './api-handler.js'

// Meratto Backend API Middleware Plugin for Vite
function adminApiPlugin() {
  return {
    name: 'meratto-backend-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          if (req.url && req.url.startsWith('/api')) {
            const env = loadEnv('development', process.cwd(), '');
            const handled = await handleApiRequest(req, res, env);
            if (handled) return;
          }
        } catch (err) {
          console.error('[API Middleware Error]:', err);
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), adminApiPlugin()],
  server: {
    port: 5500,
    host: true
  }
})

