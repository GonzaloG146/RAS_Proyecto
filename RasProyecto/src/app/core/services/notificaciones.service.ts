import { Injectable, computed, signal } from '@angular/core';
import { Notificacion } from '../models/notificacion.model';
import { NOTIFICACIONES_MOCK } from '../mock-data';

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  private readonly _notificaciones = signal<Notificacion[]>([...NOTIFICACIONES_MOCK]);

  readonly notificaciones = this._notificaciones.asReadonly();

  readonly noLeidas = computed(() => this._notificaciones().filter((n) => !n.leida).length);

  marcarLeida(id: string): void {
    this._notificaciones.update((lista) =>
      lista.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
  }

  marcarTodasLeidas(): void {
    this._notificaciones.update((lista) => lista.map((n) => ({ ...n, leida: true })));
  }
}
