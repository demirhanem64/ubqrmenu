// @ts-nocheck
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom Vite plugin to handle local JSON saving during dev mode
function localJsonEditorPlugin() {
  return {
    name: 'local-json-editor',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method === 'POST' && req.url?.startsWith('/api/save/')) {
          const type = req.url.split('/').pop();
          
          if (!['businesses', 'categories', 'products'].includes(type || '')) {
            res.statusCode = 400;
            res.end('Invalid data type');
            return;
          }

          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          
          req.on('end', () => {
            try {
              // Parse to ensure it's valid JSON
              JSON.parse(body);
              
              const filePath = path.resolve(__dirname, `src/data/${type}.json`);
              fs.writeFileSync(filePath, body, 'utf-8');
              
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, message: 'Saved successfully' }));
            } catch (err) {
              console.error('Failed to save JSON', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        } else if (req.method === 'POST' && req.url?.startsWith('/api/upload')) {
          const urlObj = new URL(req.url, `http://${req.headers.host}`);
          const filename = urlObj.searchParams.get('filename') || `upload_${Date.now()}.jpg`;
          
          const assetsDir = path.resolve(__dirname, 'public/assets');
          if (!fs.existsSync(assetsDir)) {
            fs.mkdirSync(assetsDir, { recursive: true });
          }

          const uploadPath = path.resolve(assetsDir, filename);
          const writeStream = fs.createWriteStream(uploadPath);
          
          req.pipe(writeStream);
          
          req.on('end', () => {
             res.statusCode = 200;
             res.setHeader('Content-Type', 'application/json');
             res.end(JSON.stringify({ url: `/assets/${filename}` }));
          });
          
          req.on('error', (err) => {
             console.error('Upload error', err);
             res.statusCode = 500;
             res.end(JSON.stringify({ error: err.message }));
          });
        } else {
          next();
        }
      });
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), localJsonEditorPlugin()],
  base: '/', // Custom domain uses root
})
