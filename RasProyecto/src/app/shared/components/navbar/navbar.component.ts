import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificacionesService } from '../../../core/services/notificaciones.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="navbar">
      <div class="navbar-left">
        <button class="btn-hamburguesa" type="button" (click)="menuToggle.emit()" aria-label="Abrir menú">
          ☰
        </button>
        <a routerLink="/inicio" class="logo">RAS</a>
      </div>

      <div class="navbar-right">
        @if (notificacionesService.noLeidas() > 0) {
          <span class="punto-alerta"></span>
        }
        <div class="avatar-wrapper">
          <button class="avatar-btn" type="button" (click)="menuAbierto.set(!menuAbierto())">
            {{ auth.usuario()?.iniciales }}
          </button>

          @if (menuAbierto()) {
            <div class="dropdown">
              <a routerLink="/mi-perfil" (click)="menuAbierto.set(false)">👤 Mi perfil</a>
              <a routerLink="/notificaciones" (click)="menuAbierto.set(false)">🔔 Notificaciones</a>
              <a routerLink="/pqr" (click)="menuAbierto.set(false)">❓ Ayuda / Soporte</a>
              <button type="button" class="dropdown-salir" (click)="salir()">🚪 Cerrar sesión</button>
            </div>
          }
        </div>
        <button class="btn-salir" type="button" (click)="salir()">Salir</button>
      </div>
    </header>
  `,
  styles: [
    `
      .navbar {
        height: var(--topbar-height);
        background: var(--ras-green-900);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        position: sticky;
        top: 0;
        z-index: 950;
      }
      .navbar-left { display: flex; align-items: center; gap: 14px; }
      .logo {
        color: var(--ras-white);
        font-family: var(--font-heading);
        font-weight: 700;
        font-size: 18px;
        letter-spacing: 0.02em;
      }
      .btn-hamburguesa {
        display: none;
        background: transparent;
        border: none;
        color: var(--ras-white);
        font-size: 18px;
      }
      .navbar-right { display: flex; align-items: center; gap: 14px; position: relative; }
      .punto-alerta {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #ef4444;
        display: inline-block;
      }
      .avatar-wrapper { position: relative; }
      .avatar-btn {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: var(--ras-green-500);
        color: var(--ras-white);
        border: none;
        font-weight: 700;
        font-size: 13px;
      }
      .dropdown {
        position: absolute;
        right: 0;
        top: 42px;
        background: var(--ras-white);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-modal);
        min-width: 200px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 960;
        animation: ras-fade-in 0.12s ease;
      }
      .dropdown a,
      .dropdown-salir {
        padding: 11px 16px;
        font-size: 14px;
        color: var(--ras-text);
        text-align: left;
        background: none;
        border: none;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .dropdown a:hover, .dropdown-salir:hover { background: var(--ras-bg); }
      .dropdown-salir { color: var(--badge-red-text); border-top: 1px solid var(--ras-border-soft); }

      .btn-salir {
        background: var(--ras-green-700);
        color: var(--ras-white);
        border: none;
        padding: 8px 16px;
        border-radius: var(--radius-sm);
        font-size: 13px;
        font-weight: 600;
      }
      .btn-salir:hover { background: var(--ras-green-600); }

      @media (max-width: 900px) {
        .btn-hamburguesa { display: inline-flex; }
      }
    `
  ]
})
export class NavbarComponent {
  @Output() menuToggle = new EventEmitter<void>();

  protected readonly auth = inject(AuthService);
  protected readonly notificacionesService = inject(NotificacionesService);
  private readonly router = inject(Router);

  readonly menuAbierto = signal(false);

  salir(): void {
    this.menuAbierto.set(false);
    this.auth.cerrarSesion();
    this.router.navigate(['/']);
  }
}
