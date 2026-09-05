import { Injectable, computed, signal } from '@angular/core';
import { Resena } from '../models/resena.model';
import { RESENAS_MOCK } from '../mock-data';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ResenasService {
  private readonly auth = inject(AuthService);

  private readonly _resenas = signal<Resena[]>([...RESENAS_MOCK]);

  readonly resenas = this._resenas.asReadonly();

  readonly promedio = computed(() => {
    const lista = this._resenas();
    if (lista.length === 0) return 0;
    const suma = lista.reduce((acc, r) => acc + r.estrellas, 0);
    return Math.round((suma / lista.length) * 10) / 10;
  });

  /** Agrega una nueva calificación (RF09) y actualiza el rating agregado del usuario. */
  calificar(datos: { nombreContraparte: string; estrellas: number; comentario: string }): void {
    const iniciales = datos.nombreContraparte
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join('');
    const colores = ['#2f9d5b', '#3b82f6', '#d9a441', '#8b5cf6', '#f472b6'];
    const nueva: Resena = {
      nombre: datos.nombreContraparte,
      iniciales: iniciales || 'AP',
      color: colores[Math.floor(Math.random() * colores.length)],
      estrellas: datos.estrellas,
      fecha: 'Hoy',
      comentario: datos.comentario || 'Sin comentario adicional.'
    };
    this._resenas.update((lista) => [nueva, ...lista]);

    const u = this.auth.usuario();
    if (u) {
      const totalResenas = u.totalResenas + 1;
      const nuevoRating = Math.round(((u.rating * u.totalResenas + datos.estrellas) / totalResenas) * 10) / 10;
      this.auth.actualizarPerfil({ totalResenas, rating: nuevoRating });
    }
  }
}
