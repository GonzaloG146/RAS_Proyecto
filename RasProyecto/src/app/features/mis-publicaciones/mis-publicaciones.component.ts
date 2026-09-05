import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { PublicacionesService } from '../../core/services/publicaciones.service';
import { TruequesService } from '../../core/services/trueques.service';
import { Publicacion, PropuestaRecibida, TipoPublicacion } from '../../core/models/publicacion.model';

type FiltroPub = 'todas' | 'activas' | 'conPropuestas' | 'pausadas' | 'cerradas';

@Component({
  selector: 'app-mis-publicaciones',
  standalone: true,
  imports: [FormsModule, RouterLink, BadgeComponent, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mis-publicaciones.component.html',
  styleUrl: './mis-publicaciones.component.scss'
})
export class MisPublicacionesComponent implements OnInit {
  private readonly publicacionesService = inject(PublicacionesService);
  private readonly truequesService = inject(TruequesService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('nueva')) {
      this.abrirNuevaPublicacion();
    }
  }

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

  // ---- Modal: nueva publicación / editar ----
  readonly modalNuevaAbierto = signal(false);
  readonly confirmacionVisible = signal(false);
  readonly modoEdicion = signal(false);
  publicacionEditandoId = '';
  tituloNueva = '';
  descripcionNueva = '';
  tipoNueva: TipoPublicacion = 'Trueque';
  categoriaNueva = 'Uniformes';
  sedeNueva = 'Sede Kennedy';

  abrirNuevaPublicacion(): void {
    this.modoEdicion.set(false);
    this.tituloNueva = '';
    this.descripcionNueva = '';
    this.tipoNueva = 'Trueque';
    this.categoriaNueva = 'Uniformes';
    this.sedeNueva = 'Sede Kennedy';
    this.modalNuevaAbierto.set(true);
  }

  abrirEditar(pub: Publicacion): void {
    this.modoEdicion.set(true);
    this.publicacionEditandoId = pub.id;
    this.tituloNueva = pub.titulo;
    this.descripcionNueva = pub.descripcion;
    this.tipoNueva = pub.tipo;
    this.categoriaNueva = pub.categoria;
    this.sedeNueva = pub.sede;
    this.modalNuevaAbierto.set(true);
  }

  publicar(): void {
    if (!this.tituloNueva.trim()) return;
    if (this.modoEdicion()) {
      this.publicacionesService.editar(this.publicacionEditandoId, {
        titulo: this.tituloNueva,
        descripcion: this.descripcionNueva,
        tipo: this.tipoNueva,
        categoria: this.categoriaNueva,
        sede: this.sedeNueva
      });
    } else {
      this.publicacionesService.crearPublicacion({
        titulo: this.tituloNueva,
        descripcion: this.descripcionNueva,
        tipo: this.tipoNueva,
        categoria: this.categoriaNueva,
        sede: this.sedeNueva
      });
    }
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

  aceptarPropuesta(pub: Publicacion, propuesta: PropuestaRecibida): void {
    this.publicacionesService.aceptarPropuesta(pub.id, propuesta.id);
    this.truequesService.crear({
      ofreces: { icono: pub.icono, nombre: pub.titulo, categoria: pub.categoria },
      recibes: { icono: '📦', nombre: propuesta.ofrece, categoria: 'General' },
      contraparteNombre: propuesta.nombre,
      contraparteSede: pub.sede,
      contraparteIniciales: propuesta.iniciales,
      contraparteColor: propuesta.colorAvatar
    });
    this.modalPropuestasAbierto.set(false);
  }

  rechazarPropuesta(pub: Publicacion, propuesta: PropuestaRecibida): void {
    this.publicacionesService.rechazarPropuesta(pub.id, propuesta.id);
    const actualizada = this.publicacionesService.misPublicaciones().find((p) => p.id === pub.id) ?? null;
    this.publicacionSeleccionada.set(actualizada);
  }

  pausar(pub: Publicacion): void {
    this.publicacionesService.pausar(pub.id);
  }

  reactivar(pub: Publicacion): void {
    this.publicacionesService.reactivar(pub.id);
  }
}
