import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { AuthService } from '../../core/services/auth.service';
import { RESENAS_MOCK } from '../../core/mock-data';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [FormsModule, RouterLink, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.scss'
})
export class MiPerfilComponent {
  private readonly auth = inject(AuthService);

  readonly usuario = this.auth.usuario;
  readonly resenas = RESENAS_MOCK;

  readonly modalEditarAbierto = signal(false);

  // Campos editables del formulario del modal
  nombreEditado = '';
  programaEditado = '';
  telefonoEditado = '';
  sedeEditada = '';

  abrirEditar(): void {
    const u = this.usuario();
    if (!u) return;
    this.nombreEditado = u.nombre;
    this.programaEditado = u.programa;
    this.telefonoEditado = u.telefono;
    this.sedeEditada = u.sede;
    this.modalEditarAbierto.set(true);
  }

  guardarPerfil(): void {
    this.auth.actualizarPerfil({
      nombre: this.nombreEditado,
      programa: this.programaEditado,
      telefono: this.telefonoEditado,
      sede: this.sedeEditada
    });
    this.modalEditarAbierto.set(false);
  }

  estrellas(cantidad: number): string[] {
    return Array.from({ length: 5 }, (_, i) => (i < Math.round(cantidad) ? '★' : '☆'));
  }
}
