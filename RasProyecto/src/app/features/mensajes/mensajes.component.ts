import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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

  readonly filtro = signal<FiltroConv>('todos');
  readonly conversaciones = this.mensajesService.conversaciones;
  readonly conversacionActivaId = signal<string>(this.mensajesService.conversaciones()[0]?.id ?? '');
  readonly mostrarChatMovil = signal(false);

  readonly conversacionesFiltradas = computed(() => {
    const lista = this.conversaciones();
    return this.filtro() === 'noLeidos' ? lista.filter((c) => c.noLeidos > 0) : lista;
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
}
