import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { PublicacionesService } from '../../core/services/publicaciones.service';
import { TruequesService } from '../../core/services/trueques.service';
import { MensajesService } from '../../core/services/mensajes.service';
import { AuthService } from '../../core/services/auth.service';
import { Publicacion } from '../../core/models/publicacion.model';

type TipoFiltro = 'todos' | 'Trueque' | 'Donación';

@Component({
  selector: 'app-explorar',
  standalone: true,
  imports: [FormsModule, RouterLink, BadgeComponent, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './explorar.component.html',
  styleUrl: './explorar.component.scss'
})
export class ExplorarComponent {
  private readonly publicacionesService = inject(PublicacionesService);
  private readonly truequesService = inject(TruequesService);
  private readonly mensajesService = inject(MensajesService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly usuario = this.auth.usuario;

  readonly busqueda = signal('');
  readonly filtroTipo = signal<TipoFiltro>('todos');
  readonly filtroCategoria = signal('Todas');
  readonly filtroSede = signal('Todas');

  readonly categorias = ['Todas', 'Uniformes', 'Libros', 'Equipos', 'Ropa', 'Herramientas', 'Material'];
  readonly sedes = ['Todas', 'Sede Kennedy', 'Sede Norte', 'Sede Centro', 'Sede Sur'];

  private readonly todasLasPublicaciones = computed<Publicacion[]>(() => [
    ...this.publicacionesService.publicacionesComunidad(),
    ...this.publicacionesService.misPublicaciones().filter((p) => p.estado === 'Activa')
  ]);

  readonly resultados = computed<Publicacion[]>(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const tipo = this.filtroTipo();
    const categoria = this.filtroCategoria();
    const sede = this.filtroSede();

    return this.todasLasPublicaciones().filter((p) => {
      const coincideTexto =
        !texto ||
        p.titulo.toLowerCase().includes(texto) ||
        p.descripcion.toLowerCase().includes(texto) ||
        p.categoria.toLowerCase().includes(texto);
      const coincideTipo = tipo === 'todos' || p.tipo === tipo;
      const coincideCategoria = categoria === 'Todas' || p.categoria === categoria;
      const coincideSede = sede === 'Todas' || p.sede === sede;
      return coincideTexto && coincideTipo && coincideCategoria && coincideSede;
    });
  });

  limpiarFiltros(): void {
    this.busqueda.set('');
    this.filtroTipo.set('todos');
    this.filtroCategoria.set('Todas');
    this.filtroSede.set('Todas');
  }

  // ---- Modal detalle / proponer trueque ----
  readonly publicacionSeleccionada = signal<Publicacion | null>(null);
  readonly vistaModal = signal<'detalle' | 'exito'>('detalle');
  ofrezcoTitulo = '';
  mensajePropuesta = '';

  esPropia(pub: Publicacion): boolean {
    return this.publicacionesService.misPublicaciones().some((p) => p.id === pub.id);
  }

  abrirDetalle(pub: Publicacion): void {
    this.publicacionSeleccionada.set(pub);
    this.vistaModal.set('detalle');
    const misActivas = this.publicacionesService.misPublicaciones().filter((p) => p.estado === 'Activa');
    this.ofrezcoTitulo = misActivas[0]?.titulo ?? '';
    this.mensajePropuesta = `Hola! Me interesa tu publicación "${pub.titulo}". ¿Seguimos hablando por aquí?`;
  }

  cerrarModal(): void {
    this.publicacionSeleccionada.set(null);
  }

  get misPublicacionesActivas() {
    return this.publicacionesService.misPublicaciones().filter((p) => p.estado === 'Activa');
  }

  enviarPropuesta(): void {
    const pub = this.publicacionSeleccionada();
    const u = this.usuario();
    if (!pub || !u || !this.ofrezcoTitulo) return;

    this.publicacionesService.agregarPropuestaComunidad(pub.id, {
      id: 'pr-' + Date.now(),
      nombre: u.nombre,
      iniciales: u.iniciales,
      colorAvatar: u.colorAvatar,
      ofrece: this.ofrezcoTitulo
    });

    this.truequesService.crear({
      ofreces: { icono: '📦', nombre: this.ofrezcoTitulo, categoria: 'General' },
      recibes: { icono: pub.icono, nombre: pub.titulo, categoria: pub.categoria },
      contraparteNombre: pub.autorNombre,
      contraparteSede: pub.sede,
      contraparteIniciales: pub.autorIniciales,
      contraparteColor: pub.autorColor
    });

    this.mensajesService.iniciarConversacion({
      contactoNombre: pub.autorNombre,
      contactoIniciales: pub.autorIniciales,
      contactoColor: pub.autorColor,
      contactoSede: pub.sede,
      etiquetaArticulo: pub.titulo,
      intercambioArticulo: `${this.ofrezcoTitulo} a cambio de: ${pub.titulo}`,
      mensajeInicial: this.mensajePropuesta
    });

    this.vistaModal.set('exito');
  }

  irAMisTrueques(): void {
    this.cerrarModal();
    this.router.navigate(['/mis-trueques']);
  }

  irAMensajes(): void {
    this.cerrarModal();
    this.router.navigate(['/mensajes']);
  }
}
