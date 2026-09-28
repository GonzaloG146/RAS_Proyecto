import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';

type ColorBadge = 'blue' | 'amber' | 'green' | 'red' | 'gray' | 'purple';

const MAPA_ESTADOS: Record<string, ColorBadge> = {
  'Activa': 'green',
  'Trueque': 'blue',
  'Donación': 'amber',
  'En curso': 'blue',
  'Negociando': 'amber',
  'Esperando respuesta': 'amber',
  'Completado': 'green',
  'Completada': 'green',
  'Cerrada': 'gray',
  'Pausada': 'gray',
  'Cancelado': 'red',
  'Cancelada': 'red',
  'Radicada': 'purple',
  'En revisión': 'purple',
  'Resuelta': 'green',
  'Petición': 'blue',
  'Queja': 'amber',
  'Reclamo': 'red'
};

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [class]="'badge-' + color()">
      @if (mostrarPunto()) { <span class="dot"></span> }
      {{ texto() }}
    </span>
  `,
  styles: [
    `
      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
        display: inline-block;
      }
    `
  ]
})
export class BadgeComponent {
  private readonly _estado = signal('');
  private readonly _conPunto = signal(false);

  @Input({ required: true }) set estado(valor: string) {
    this._estado.set(valor);
  }

  @Input() set conPunto(valor: boolean) {
    this._conPunto.set(valor);
  }

  readonly texto = computed(() => this._estado());
  readonly mostrarPunto = computed(() => this._conPunto());
  readonly color = computed<ColorBadge>(() => MAPA_ESTADOS[this._estado()] ?? 'gray');
}
