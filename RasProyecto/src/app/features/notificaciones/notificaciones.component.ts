import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NotificacionesService } from '../../core/services/notificaciones.service';
import { MensajesService } from '../../core/services/mensajes.service';
import { Notificacion } from '../../core/models/notificacion.model';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.scss'
})
export class NotificacionesComponent {
  private readonly notificacionesService = inject(NotificacionesService);
  private readonly mensajesService = inject(MensajesService);
  private readonly router = inject(Router);

  readonly notificaciones = this.notificacionesService.notificaciones;
  readonly noLeidas = this.notificacionesService.noLeidas;

  marcarTodasLeidas(): void {
    this.notificacionesService.marcarTodasLeidas();
  }

  abrir(n: Notificacion): void {
    this.notificacionesService.marcarLeida(n.id);
    if (n.conversacionId) {
      this.mensajesService.marcarLeida(n.conversacionId);
      this.router.navigate(['/mensajes']);
    } else if (n.truequeId) {
      this.router.navigate(['/mis-trueques']);
    } else if (n.publicacionId) {
      this.router.navigate(['/mis-publicaciones']);
    }
  }
}
