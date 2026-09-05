import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { PublicacionesService } from '../../core/services/publicaciones.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, BadgeComponent, StatCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  private readonly publicacionesService = inject(PublicacionesService);

  readonly publicaciones = this.publicacionesService.publicacionesComunidad;

  readonly pasos = [
    { numero: 1, icono: '📝', titulo: 'Regístrate', texto: 'Crea tu cuenta con tu correo Mi SENA o personal. Es gratis y toma menos de 2 minutos.' },
    { numero: 2, icono: '📦', titulo: 'Publica o busca', texto: 'Publica artículos que ya no uses o busca lo que necesitas entre los artículos de tu comunidad.' },
    { numero: 3, icono: '🤝', titulo: 'Propón un trueque', texto: 'Envía una propuesta de intercambio, negocia por chat y coordina el punto de encuentro.' },
    { numero: 4, icono: '⭐', titulo: 'Califica y listo', texto: 'Sube la evidencia del intercambio, califica al otro aprendiz y ¡disfruta lo que obtuviste!' }
  ];

  readonly stats = [
    { icono: '📋', valor: 342, etiqueta: 'Total publicaciones' },
    { icono: '👤', valor: 89, etiqueta: 'Aprendices activos' },
    { icono: '🔄', valor: 127, etiqueta: 'Intercambios' },
    { icono: '❤️', valor: 58, etiqueta: 'Donaciones' }
  ];
}
