import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { readFileSync } from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: readFileSync('certs/create-cert-key.pem'),
      cert: readFileSync('certs/create-cert.pem'),
    },
  },
});
