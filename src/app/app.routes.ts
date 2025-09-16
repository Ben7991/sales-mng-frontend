import { Routes } from '@angular/router';
import { NAVIGATION_ROUTES } from '@shared/constants/navigation.constant';
import { MainComponent } from 'pages/main/main.component';
import { NotFoundComponent } from 'pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: NAVIGATION_ROUTES.AUTH.LOGIN,
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('../pages/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'main',
    component: MainComponent,
    loadChildren: () =>
      import('../pages/main/main.routes').then(m => m.mainRoutePaths)
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
