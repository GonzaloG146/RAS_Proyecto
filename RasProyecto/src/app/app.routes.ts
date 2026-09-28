import { Routes } from '@angular/router';
import { authGuard } from './servicios/guards/auth.guard';
import { PrivateLayoutComponent } from './directives/private-layout/private-layout.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/landing/landing.component').then((m) => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/auth.component').then((m) => m.AuthComponent)
  },
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./components/inicio/inicio.component').then((m) => m.InicioComponent)
      },
      {
        path: 'explorar',
        loadComponent: () => import('./components/explorar/explorar.component').then((m) => m.ExplorarComponent)
      },
      {
        path: 'mi-perfil',
        loadComponent: () => import('./components/mi-perfil/mi-perfil.component').then((m) => m.MiPerfilComponent)
      },
      {
        path: 'mis-publicaciones',
        loadComponent: () =>
          import('./components/mis-publicaciones/mis-publicaciones.component').then((m) => m.MisPublicacionesComponent)
      },
      {
        path: 'mis-trueques',
        loadComponent: () =>
          import('./components/mis-trueques/mis-trueques.component').then((m) => m.MisTruequesComponent)
      },
      {
        path: 'mensajes',
        loadComponent: () => import('./components/mensajes/mensajes.component').then((m) => m.MensajesComponent)
      },
      {
        path: 'notificaciones',
        loadComponent: () =>
          import('./components/notificaciones/notificaciones.component').then((m) => m.NotificacionesComponent)
      },
      {
        path: 'pqr',
        loadComponent: () => import('./components/pqr/pqr.component').then((m) => m.PqrComponent)
      },
      { path: '', pathMatch: 'full', redirectTo: 'inicio' }
    ]
  },
  { path: '**', redirectTo: '' }
];
