import { Injectable, computed, signal } from '@angular/core';
import { Trueque } from '../models/trueque.model';
import { TRUEQUES_MOCK } from '../mock-data';

@Injectable({ providedIn: 'root' })
export class TruequesService {
  private readonly _trueques = signal<Trueque[]>([...TRUEQUES_MOCK]);

  readonly trueques = this._trueques.asReadonly();

  readonly stats = computed(() => {
    const lista = this._trueques();
    return {
      total: lista.length,
      enCurso: lista.filter((t) => t.estado === 'En curso').length,
      negociando: lista.filter((t) => t.estado === 'Negociando' || t.estado === 'Esperando respuesta').length,
      completados: lista.filter((t) => t.estado === 'Completado').length,
      cancelados: lista.filter((t) => t.estado === 'Cancelado').length
    };
  });

  porId(id: string): Trueque | undefined {
    return this._trueques().find((t) => t.id === id);
  }

  subirEvidencia(id: string): void {
    this._trueques.update((lista) =>
      lista.map((t) =>
        t.id === id
          ? { ...t, evidenciaSubida: true, pasoActual: 4, actualizado: 'Actualizado ahora' }
          : t
      )
    );
  }

  cancelar(id: string, motivo = 'Cancelado por el usuario.'): void {
    this._trueques.update((lista) =>
      lista.map((t) =>
        t.id === id
          ? { ...t, estado: 'Cancelado', motivoCancelacion: motivo, actualizado: 'Cancelado ahora mismo' }
          : t
      )
    );
  }
}
