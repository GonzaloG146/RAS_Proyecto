import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { PublicacionesService } from '../../core/services/publicaciones.service';
import { Publicacion, TipoPublicacion } from '../../core/models/publicacion.model';

type FiltroPub = 'todas' | 'activas' | 'conPropuestas' | 'pausadas' | 'cerradas';

@Component({
  selector: 'app-mis-publicaciones',
  standalone: true,
  imports: [FormsModule, RouterLink, BadgeComponent, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mis-publicaciones.component.html',
  styleUrl: './mis-publicaciones.component.scss'
})
export class MisPublicacionesComponent {
  private readonly publicacionesService = inject(PublicacionesService);

  readonly stats = this.publicacionesService.stats;
  readonly filtro = signal<FiltroPub>('todas');

  readonly publicacionesFiltradas = computed<Publicacion[]>(() => {
    const lista = this.publicacionesService.misPublicaciones();
    switch (this.filtro()) {
      case 'activas': return lista.filter((p) => p.estado === 'Activa');
      case 'conPropuestas': return lista.filter((p) => p.propuestas.length > 0);
      case 'pausadas': return lista.filter((p) => p.estado === 'Pausada');
      case 'cerradas': return lista.filter((p) => p.estado === 'Cerrada');
      default: return lista;
    }
  });

  // ---- Modal: nueva publicación ----
  readonly modalNuevaAbierto = signal(false);
  readonly confirmacionVisible = signal(false);
  tituloNueva = '';
  descripcionNueva = '';
  tipoNueva: TipoPublicacion = 'Trueque';
  categoriaNueva = 'Uniformes';
  sedeNueva = 'Sede Kennedy';

  abrirNuevaPublicacion(): void {
    this.tituloNueva = '';
    this.descripcionNueva = '';
    this.tipoNueva = 'Trueque';
    this.categoriaNueva = 'Uniformes';
    this.sedeNueva = 'Sede Kennedy';
    this.modalNuevaAbierto.set(true);
  }

  publicar(): void {
    if (!this.tituloNueva.trim()) return;
    this.publicacionesService.crearPublicacion({
      titulo: this.tituloNueva,
      descripcion: this.descripcionNueva,
      tipo: this.tipoNueva,
      categoria: this.categoriaNueva,
      sede: this.sedeNueva
    });
    this.modalNuevaAbierto.set(false);
    this.confirmacionVisible.set(true);
    setTimeout(() => this.confirmacionVisible.set(false), 3200);
  }

  // ---- Modal: ver propuestas ----
  readonly modalPropuestasAbierto = signal(false);
  readonly publicacionSeleccionada = signal<Publicacion | null>(null);

  verPropuestas(pub: Publicacion): void {
    this.publicacionSeleccionada.set(pub);
    this.modalPropuestasAbierto.set(true);
  }

  pausar(pub: Publicacion): void {
    this.publicacionesService.pausar(pub.id);
  }

  reactivar(pub: Publicacion): void {
    this.publicacionesService.reactivar(pub.id);
  }
}
