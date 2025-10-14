import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'auth/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'main/**',
    renderMode: RenderMode.Server
  },
  // Pre-render everything else
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
