import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { TruequesService } from '../../core/services/trueques.service';
import { Trueque } from '../../core/models/trueque.model';

type FiltroTrueque = 'todos' | 'enCurso' | 'negociando' | 'completados' | 'cancelados';

const PASOS = ['Propuesta enviada', 'Aceptada', 'Punto de encuentro', 'Evidencia', 'Completado'];

@Component({
  selector: 'app-mis-trueques',
  standalone: true,
  imports: [FormsModule, RouterLink, BadgeComponent, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mis-trueques.component.html',
  styleUrl: './mis-trueques.component.scss'
})
export class MisTruequesComponent {
  private readonly truequesService = inject(TruequesService);

  readonly pasos = PASOS;
  readonly stats = this.truequesService.stats;
  readonly filtro = signal<FiltroTrueque>('todos');

  readonly truequesFiltrados = computed<Trueque[]>(() => {
    const lista = this.truequesService.trueques();
    switch (this.filtro()) {
      case 'enCurso': return lista.filter((t) => t.estado === 'En curso');
      case 'negociando': return lista.filter((t) => t.estado === 'Negociando' || t.estado === 'Esperando respuesta');
      case 'completados': return lista.filter((t) => t.estado === 'Completado');
      case 'cancelados': return lista.filter((t) => t.estado === 'Cancelado');
      default: return lista;
    }
  });

  // ---- Modal subir evidencia (estados: 'form' | 'exito') ----
  readonly modalEvidenciaAbierto = signal(false);
  readonly vistaModalEvidencia = signal<'form' | 'exito'>('form');
  readonly truequeSeleccionado = signal<Trueque | null>(null);
  descripcionEvidencia = '';
  tipoEvidencia = 'Foto de los artículos intercambiados';

  abrirSubirEvidencia(t: Trueque): void {
    this.truequeSeleccionado.set(t);
    this.descripcionEvidencia = '';
    this.tipoEvidencia = 'Foto de los artículos intercambiados';
    this.vistaModalEvidencia.set('form');
    this.modalEvidenciaAbierto.set(true);
  }

  enviarEvidencia(): void {
    const t = this.truequeSeleccionado();
    if (!t) return;
    this.truequesService.subirEvidencia(t.id);
    this.vistaModalEvidencia.set('exito');
  }

  cerrarModalEvidencia(): void {
    this.modalEvidenciaAbierto.set(false);
  }

  cancelar(t: Trueque): void {
    this.truequesService.cancelar(t.id, 'Cancelado por el usuario desde la plataforma.');
  }

  estadoPaso(t: Trueque, indice: number): 'hecho' | 'actual' | 'pendiente' {
    const paso = indice + 1;
    if (t.estado === 'Cancelado') return paso <= t.pasoActual ? 'hecho' : 'pendiente';
    if (paso < t.pasoActual) return 'hecho';
    if (paso === t.pasoActual) return t.estado === 'Completado' ? 'hecho' : 'actual';
    return 'pendiente';
  }
}
