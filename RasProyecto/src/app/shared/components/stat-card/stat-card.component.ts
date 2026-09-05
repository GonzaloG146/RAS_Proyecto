import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stat-card">
      @if (icono) { <span class="stat-icon">{{ icono }}</span> }
      <div class="stat-body">
        <span class="stat-valor">{{ valor }}</span>
        <span class="stat-etiqueta">{{ etiqueta }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      .stat-card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 18px;
      }
      .stat-icon { font-size: 22px; }
      .stat-body { display: flex; flex-direction: column; }
      .stat-valor {
        font-family: var(--font-heading);
        font-size: 22px;
        font-weight: 700;
        color: var(--ras-text);
        line-height: 1.2;
      }
      .stat-etiqueta { font-size: 12.5px; color: var(--ras-text-muted); }
    `
  ]
})
export class StatCardComponent {
  @Input() icono?: string;
  @Input() valor: string | number = 0;
  @Input() etiqueta = '';
}
