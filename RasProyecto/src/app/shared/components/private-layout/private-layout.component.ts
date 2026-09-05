import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-private-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, BottomNavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="layout">
      <app-navbar (menuToggle)="sidebarAbierto.set(!sidebarAbierto())"></app-navbar>
      <div class="layout-body">
        @if (sidebarAbierto()) {
          <div class="overlay-movil" (click)="sidebarAbierto.set(false)"></div>
        }
        <div class="sidebar-slot" [class.visible]="sidebarAbierto()">
          <app-sidebar (itemClick)="sidebarAbierto.set(false)"></app-sidebar>
        </div>
        <main class="contenido">
          <router-outlet></router-outlet>
        </main>
      </div>
      <app-bottom-nav></app-bottom-nav>
    </div>
  `,
  styles: [
    `
      .layout { min-height: 100vh; display: flex; flex-direction: column; }
      .layout-body { display: flex; flex: 1; position: relative; }
      .contenido { flex: 1; min-width: 0; }
      .overlay-movil {
        display: none;
      }

      @media (max-width: 900px) {
        .sidebar-slot { display: none; }
        .sidebar-slot.visible { display: block; }
        .overlay-movil {
          display: block;
          position: fixed;
          inset: 0;
          top: var(--topbar-height);
          background: rgba(13, 53, 30, 0.35);
          z-index: 890;
        }
        .contenido { padding-bottom: 62px; }
      }
    `
  ]
})
export class PrivateLayoutComponent {
  readonly sidebarAbierto = signal(false);
}
