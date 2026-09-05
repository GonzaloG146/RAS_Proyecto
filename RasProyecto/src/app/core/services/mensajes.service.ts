import { Injectable, computed, signal } from '@angular/core';
import { Conversacion } from '../models/mensaje.model';
import { CONVERSACIONES_MOCK } from '../mock-data';

@Injectable({ providedIn: 'root' })
export class MensajesService {
  private readonly _conversaciones = signal<Conversacion[]>(
    JSON.parse(JSON.stringify(CONVERSACIONES_MOCK))
  );

  readonly conversaciones = this._conversaciones.asReadonly();

  readonly totalNoLeidos = computed(() =>
    this._conversaciones().reduce((acc, c) => acc + c.noLeidos, 0)
  );

  porId(id: string): Conversacion | undefined {
    return this._conversaciones().find((c) => c.id === id);
  }

  marcarLeida(id: string): void {
    this._conversaciones.update((lista) =>
      lista.map((c) => (c.id === id ? { ...c, noLeidos: 0 } : c))
    );
  }

  enviarMensaje(conversacionId: string, texto: string): void {
    const hora = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    this._conversaciones.update((lista) =>
      lista.map((c) => {
        if (c.id !== conversacionId) return c;
        const nuevoMensaje = { id: 'm-' + Date.now(), texto, hora, propio: true };
        return {
          ...c,
          mensajes: [...c.mensajes, nuevoMensaje],
          ultimoMensaje: texto,
          hora: 'Ahora'
        };
      })
    );
  }
}
