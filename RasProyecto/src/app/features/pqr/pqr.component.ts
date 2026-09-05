import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { PqrService } from '../../core/services/pqr.service';
import { Pqr, TipoPqr } from '../../core/models/pqr.model';

type Pestana = 'nueva' | 'mis';

@Component({
  selector: 'app-pqr',
  standalone: true,
  imports: [FormsModule, RouterLink, BadgeComponent, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pqr.component.html',
  styleUrl: './pqr.component.scss'
})
export class PqrComponent {
  private readonly pqrService = inject(PqrService);

  readonly pestana = signal<Pestana>('mis');
  readonly pqrs = this.pqrService.pqrs;
  readonly stats = this.pqrService.stats;
  readonly confirmacionVisible = signal(false);
  readonly referenciaCreada = signal('');

  tipoNueva: TipoPqr = 'Petición';
  asuntoNueva = '';
  descripcionNueva = '';
  relacionadoNueva = 'Consulta general';

  readonly pqrSeleccionada = signal<Pqr | null>(null);

  verDetalle(p: Pqr): void {
    this.pqrSeleccionada.set(p);
  }

  cerrarDetalle(): void {
    this.pqrSeleccionada.set(null);
  }

  radicar(): void {
    if (!this.asuntoNueva.trim() || !this.descripcionNueva.trim()) return;
    const creada = this.pqrService.radicar({
      tipo: this.tipoNueva,
      asunto: this.asuntoNueva,
      descripcion: this.descripcionNueva,
      relacionado: this.relacionadoNueva
    });
    this.referenciaCreada.set(creada.referencia);
    this.confirmacionVisible.set(true);
    this.asuntoNueva = '';
    this.descripcionNueva = '';
    this.pestana.set('mis');
    setTimeout(() => this.confirmacionVisible.set(false), 4000);
  }
}
