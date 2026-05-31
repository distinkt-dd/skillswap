import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: 'named',
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: '**/*.svg',
    }),
  ],
  resolve: {
    alias: {
      '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@entities': fileURLToPath(new URL('./src/entities', import.meta.url)),
      '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@widgets': fileURLToPath(new URL('./src/widgets', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/entities/**/model/slice.ts',
        'src/shared/ui/button/button.tsx',
        'src/shared/ui/input/input.tsx',
        'src/shared/ui/checkbox/checkbox.tsx',
        'src/shared/ui/toggler/toggler.tsx',
        'src/shared/ui/logo/logo.tsx',
        'src/shared/ui/modal/modal.tsx',
        'src/shared/ui/avatar/Avatar.tsx',
        'src/shared/ui/dropdown/Dropdown.tsx',
        'src/shared/ui/calendar/calendar.tsx',
        'src/shared/ui/radio/radio.tsx',
        'src/shared/ui/textarea/textarea.tsx',
        'src/shared/ui/subcategory/Subcategory.tsx',
        'src/shared/ui/icons/icon.tsx',
        'src/shared/ui/sidebar-item/sidebar-item.tsx',
        'src/shared/ui/notification/notification.tsx',
        // Coverage может не учитывать этот файл из-за пробела в имени.
        'src/shared/ui/form/ Form.tsx',
      ],
      exclude: ['**/*.stories.*', '**/index.ts'],
    },
  },
});
