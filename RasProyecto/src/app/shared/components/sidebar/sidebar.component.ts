import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MensajesService } from '../../../core/services/mensajes.service';
import { NotificacionesService } from '../../../core/services/notificaciones.service';

interface ItemMenu {
  ruta: string;
  etiqueta: string;
  icono: string;
  contador?: () => number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="sidebar">
      <p class="sidebar-titulo">MENÚ</p>
      <nav>
        @for (item of items; track item.ruta) {
          <a
            [routerLink]="item.ruta"
            routerLinkActive="activo"
            (click)="itemClick.emit()"
            class="sidebar-item"
          >
            <span class="icono">{{ item.icono }}</span>
            <span class="etiqueta">{{ item.etiqueta }}</span>
            @if (item.contador && item.contador()! > 0) {
              <span class="contador">{{ item.contador!() }}</span>
            }
          </a>
        }
      </nav>
    </aside>
  `,
  styles: [
    `
      .sidebar {
        width: var(--sidebar-width);
        flex-shrink: 0;
        background: var(--ras-white);
        border-right: 1px solid var(--ras-border-soft);
        padding: 24px 14px;
        min-height: calc(100vh - var(--topbar-height));
      }
      .sidebar-titulo {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.06em;
        color: var(--ras-text-soft);
        padding: 0 10px;
        margin-bottom: 10px;
      }
      nav { display: flex; flex-direction: column; gap: 2px; }
      .sidebar-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 10px;
        border-radius: var(--radius-sm);
        color: var(--ras-text-muted);
        font-size: 14px;
        font-weight: 500;
        position: relative;
      }
      .sidebar-item:hover { background: var(--ras-bg); }
      .sidebar-item.activo {
        background: var(--ras-green-100);
        color: var(--ras-green-700);
        font-weight: 600;
      }
      .icono { font-size: 16px; width: 20px; text-align: center; }
      .etiqueta { flex: 1; }
      .contador {
        background: var(--ras-green-700);
        color: var(--ras-white);
        font-size: 11px;
        font-weight: 700;
        min-width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 4px;
      }

      @media (max-width: 900px) {
        .sidebar {
          position: fixed;
          top: var(--topbar-height);
          left: 0;
          bottom: 0;
          z-index: 900;
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.12);
        }
      }
    `
  ]
})
export class SidebarComponent {
  @Output() itemClick = new EventEmitter<void>();

  private readonly mensajesService = inject(MensajesService);
  private readonly notificacionesService = inject(NotificacionesService);

  readonly items: ItemMenu[] = [
    { ruta: '/inicio', etiqueta: 'Inicio', icono: '🏠' },
    { ruta: '/explorar', etiqueta: 'Explorar', icono: '🔎' },
    { ruta: '/mi-perfil', etiqueta: 'Mi perfil', icono: '👤' },
    { ruta: '/mis-trueques', etiqueta: 'Mis trueques', icono: '🔄' },
    { ruta: '/mis-publicaciones', etiqueta: 'Mis publicaciones', icono: '📋' },
    { ruta: '/mensajes', etiqueta: 'Mensajes', icono: '💬', contador: () => this.mensajesService.totalNoLeidos() },
    { ruta: '/notificaciones', etiqueta: 'Notificaciones', icono: '🔔', contador: () => this.notificacionesService.noLeidas() },
    { ruta: '/pqr', etiqueta: 'PQR', icono: '📝' }
  ];
}
