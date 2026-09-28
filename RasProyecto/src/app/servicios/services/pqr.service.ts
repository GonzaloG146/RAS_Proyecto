import { Injectable, computed, signal } from '@angular/core';
import { Pqr, TipoPqr } from '../models/pqr.model';
import { PQR_MOCK } from '../mock-data';

@Injectable({ providedIn: 'root' })
export class PqrService {
  private readonly _pqrs = signal<Pqr[]>([...PQR_MOCK]);

  readonly pqrs = this._pqrs.asReadonly();

  readonly stats = computed(() => {
    const lista = this._pqrs();
    const resueltas = lista.filter((p) => p.estado === 'Resuelta').length;
    return {
      radicadas: lista.length,
      resueltas,
      enProceso: lista.length - resueltas,
      satisfaccion: 4.8
    };
  });

  radicar(datos: { tipo: TipoPqr; asunto: string; descripcion: string; relacionado: string }): Pqr {
    const numero = String(this._pqrs().length + 43).padStart(4, '0');
    const nueva: Pqr = {
      id: 'pqr-' + Date.now(),
      referencia: `#PQR-2026-${numero}`,
      tipo: datos.tipo,
      asunto: datos.asunto,
      descripcion: datos.descripcion,
      relacionado: datos.relacionado || 'Consulta general',
      estado: 'Radicada',
      fechaRadicada: 'Radicada hoy',
      timeline: [{ texto: 'PQR radicada exitosamente', fecha: 'Hoy · pendiente de asignación' }]
    };
    this._pqrs.update((lista) => [nueva, ...lista]);
    return nueva;
  }
}
