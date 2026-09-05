import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { MensajesService } from '../../core/services/mensajes.service';

type FiltroConv = 'todos' | 'noLeidos';

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [FormsModule, RouterLink, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mensajes.component.html',
  styleUrl: './mensajes.component.scss'
})
export class MensajesComponent {
  private readonly mensajesService = inject(MensajesService);
  private readonly router = inject(Router);

  readonly filtro = signal<FiltroConv>('todos');
  readonly busqueda = signal('');
  readonly conversaciones = this.mensajesService.conversaciones;
  readonly conversacionActivaId = signal<string>(this.mensajesService.conversaciones()[0]?.id ?? '');
  readonly mostrarChatMovil = signal(false);

  readonly conversacionesFiltradas = computed(() => {
    let lista = this.conversaciones();
    if (this.filtro() === 'noLeidos') {
      lista = lista.filter((c) => c.noLeidos > 0);
    }
    const texto = this.busqueda().trim().toLowerCase();
    if (texto) {
      lista = lista.filter(
        (c) =>
          c.contactoNombre.toLowerCase().includes(texto) ||
          c.etiquetaArticulo.toLowerCase().includes(texto) ||
          c.ultimoMensaje.toLowerCase().includes(texto)
      );
    }
    return lista;
  });

  readonly conversacionActiva = computed(() =>
    this.conversaciones().find((c) => c.id === this.conversacionActivaId())
  );

  nuevoMensaje = '';
  readonly modalPerfilAbierto = signal(false);

  seleccionar(id: string): void {
    this.conversacionActivaId.set(id);
    this.mensajesService.marcarLeida(id);
    this.mostrarChatMovil.set(true);
  }

  enviar(): void {
    const texto = this.nuevoMensaje.trim();
    const conv = this.conversacionActiva();
    if (!texto || !conv) return;
    this.mensajesService.enviarMensaje(conv.id, texto);
    this.nuevoMensaje = '';
  }

  volverALista(): void {
    this.mostrarChatMovil.set(false);
  }

  verIntercambio(): void {
    this.router.navigate(['/mis-trueques']);
  }
}
