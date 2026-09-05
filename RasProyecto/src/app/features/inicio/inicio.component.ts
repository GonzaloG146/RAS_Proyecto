import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { PublicacionesService } from '../../core/services/publicaciones.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, StatCardComponent, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {
  private readonly publicacionesService = inject(PublicacionesService);
  private readonly auth = inject(AuthService);

  readonly usuario = this.auth.usuario;
  readonly publicaciones = computed(() => this.publicacionesService.publicacionesRecientes().slice(0, 6));

  readonly stats = [
    { icono: '📋', valor: 342, etiqueta: 'Total publicaciones' },
    { icono: '👤', valor: 89, etiqueta: 'Aprendices activos' },
    { icono: '🔄', valor: 127, etiqueta: 'Intercambios' },
    { icono: '❤️', valor: 58, etiqueta: 'Donaciones' }
  ];

  readonly pasos = [
    { numero: 1, icono: '📝', titulo: 'Regístrate', texto: 'Crea tu cuenta con tu correo Mi SENA o personal. Es gratis y toma menos de 2 minutos.' },
    { numero: 2, icono: '📦', titulo: 'Publica o busca', texto: 'Publica artículos que ya no uses o busca lo que necesitas entre los artículos de tu comunidad.' },
    { numero: 3, icono: '🤝', titulo: 'Propón un trueque', texto: 'Envía una propuesta de intercambio, negocia por chat y coordina el punto de encuentro en tu sede.' },
    { numero: 4, icono: '⭐', titulo: 'Califica y listo', texto: 'Sube la evidencia del intercambio, califica al otro aprendiz y ¡disfruta lo que obtuviste!' }
  ];
}
