import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { PrivateLayoutComponent } from './shared/components/private-layout/private-layout.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/landing/landing.component').then((m) => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/auth.component').then((m) => m.AuthComponent)
  },
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./features/inicio/inicio.component').then((m) => m.InicioComponent)
      },
      {
        path: 'mi-perfil',
        loadComponent: () => import('./features/mi-perfil/mi-perfil.component').then((m) => m.MiPerfilComponent)
      },
      {
        path: 'mis-publicaciones',
        loadComponent: () =>
          import('./features/mis-publicaciones/mis-publicaciones.component').then((m) => m.MisPublicacionesComponent)
      },
      {
        path: 'mis-trueques',
        loadComponent: () =>
          import('./features/mis-trueques/mis-trueques.component').then((m) => m.MisTruequesComponent)
      },
      {
        path: 'mensajes',
        loadComponent: () => import('./features/mensajes/mensajes.component').then((m) => m.MensajesComponent)
      },
      {
        path: 'notificaciones',
        loadComponent: () =>
          import('./features/notificaciones/notificaciones.component').then((m) => m.NotificacionesComponent)
      },
      {
        path: 'pqr',
        loadComponent: () => import('./features/pqr/pqr.component').then((m) => m.PqrComponent)
      },
      { path: '', pathMatch: 'full', redirectTo: 'inicio' }
    ]
  },
  { path: '**', redirectTo: '' }
];
