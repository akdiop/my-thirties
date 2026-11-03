import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', sourcemap: false,
    // Bibliothèques dans des fichiers à part : elles restent en cache sur le téléphone d'une mise à jour à l'autre.
    rollupOptions: { output: { manualChunks: (id) => {
      if (!id.includes('node_modules')) return undefined;
      if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
      if (id.includes('@supabase')) return 'supabase';
      if (id.includes('lucide-react')) return 'icons';
      return undefined;
    } } },
  },
});
