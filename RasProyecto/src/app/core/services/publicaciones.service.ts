import { Injectable, computed, signal } from '@angular/core';
import { Publicacion, PropuestaRecibida } from '../models/publicacion.model';
import { PUBLICACIONES_MOCK, PUBLICACIONES_COMUNIDAD_MOCK } from '../mock-data';

const ICONOS_POR_CATEGORIA: Record<string, string> = {
  Uniformes: '👕',
  Libros: '📚',
  Equipos: '🖥️',
  Ropa: '🎒',
  Herramientas: '🔧',
  Material: '🧮'
};

const FONDOS = ['#e7f5ec', '#eef2ff', '#fef9c3', '#fee2e2', '#e0f2fe', '#ede9fe'];

@Injectable({ providedIn: 'root' })
export class PublicacionesService {
  private readonly _misPublicaciones = signal<Publicacion[]>([...PUBLICACIONES_MOCK]);
  private readonly _publicacionesComunidad = signal<Publicacion[]>([...PUBLICACIONES_COMUNIDAD_MOCK]);

  readonly misPublicaciones = this._misPublicaciones.asReadonly();
  readonly publicacionesComunidad = this._publicacionesComunidad.asReadonly();

  /** Publicaciones recientes para el home: propias + de la comunidad. */
  readonly publicacionesRecientes = computed(() => [
    ...this._misPublicaciones().filter((p) => p.estado === 'Activa').slice(0, 3),
    ...this._publicacionesComunidad()
  ]);

  readonly stats = computed(() => {
    const propias = this._misPublicaciones();
    return {
      total: propias.length,
      activas: propias.filter((p) => p.estado === 'Activa').length,
      conPropuestas: propias.filter((p) => p.propuestas.length > 0).length,
      pausadas: propias.filter((p) => p.estado === 'Pausada').length,
      cerradas: propias.filter((p) => p.estado === 'Cerrada').length,
      vistasSemana: propias.reduce((acc, p) => acc + p.vistas, 0)
    };
  });

  crearPublicacion(datos: {
    titulo: string;
    descripcion: string;
    tipo: 'Trueque' | 'Donación';
    categoria: string;
    sede: string;
  }): Publicacion {
    const nueva: Publicacion = {
      id: 'p-' + Date.now(),
      titulo: datos.titulo,
      descripcion: datos.descripcion,
      tipo: datos.tipo,
      categoria: datos.categoria,
      sede: datos.sede,
      estado: 'Activa',
      publicadaHace: 'Publicada hoy',
      vistas: 0,
      icono: ICONOS_POR_CATEGORIA[datos.categoria] ?? '📦',
      colorFondo: FONDOS[Math.floor(Math.random() * FONDOS.length)],
      autorNombre: 'Johan G.',
      autorIniciales: 'JG',
      autorColor: '#1a6b3c',
      progreso: 0,
      esNueva: true,
      propuestas: []
    };
    this._misPublicaciones.update((lista) => [nueva, ...lista]);
    return nueva;
  }

  pausar(id: string): void {
    this.actualizarEstado(id, 'Pausada');
  }

  reactivar(id: string): void {
    this.actualizarEstado(id, 'Activa');
  }

  editar(
    id: string,
    cambios: Partial<Pick<Publicacion, 'titulo' | 'descripcion' | 'tipo' | 'categoria' | 'sede'>>
  ): void {
    this._misPublicaciones.update((lista) =>
      lista.map((p) => (p.id === id ? { ...p, ...cambios } : p))
    );
  }

  /** Elimina la propuesta aceptada y cierra la publicación (RF06). */
  aceptarPropuesta(publicacionId: string, propuestaId: string): void {
    this._misPublicaciones.update((lista) =>
      lista.map((p) =>
        p.id === publicacionId
          ? { ...p, estado: 'Cerrada', progreso: 100, propuestas: p.propuestas.filter((pr) => pr.id !== propuestaId) }
          : p
      )
    );
  }

  rechazarPropuesta(publicacionId: string, propuestaId: string): void {
    this._misPublicaciones.update((lista) =>
      lista.map((p) =>
        p.id === publicacionId
          ? { ...p, propuestas: p.propuestas.filter((pr) => pr.id !== propuestaId) }
          : p
      )
    );
  }

  /** Agrega una propuesta recibida a una publicación de la comunidad (RF06, desde Explorar). */
  agregarPropuestaComunidad(publicacionId: string, propuesta: PropuestaRecibida): void {
    this._publicacionesComunidad.update((lista) =>
      lista.map((p) => (p.id === publicacionId ? { ...p, propuestas: [...p.propuestas, propuesta] } : p))
    );
  }

  private actualizarEstado(id: string, estado: Publicacion['estado']): void {
    this._misPublicaciones.update((lista) =>
      lista.map((p) => (p.id === id ? { ...p, estado } : p))
    );
  }

  propuestasDe(id: string): PropuestaRecibida[] {
    return this._misPublicaciones().find((p) => p.id === id)?.propuestas ?? [];
  }
}
