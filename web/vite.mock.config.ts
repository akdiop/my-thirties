import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ root: '/home/user/my-thirties/web', plugins: [react(), { name: 'mock-cloud', enforce: 'pre', resolveId(id) { if (/\/lib\/cloud(\.ts)?$/.test(id)) return '/tmp/claude-0/-home-user/e95b4df3-e867-5dd1-b7b3-f1a497fc5b39/scratchpad/mock2/cloud.ts'; } }], server: { fs: { allow: ['/home/user/my-thirties/web', '/tmp/claude-0/-home-user/e95b4df3-e867-5dd1-b7b3-f1a497fc5b39/scratchpad'] } } });
