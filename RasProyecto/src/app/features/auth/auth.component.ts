import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

type Pestana = 'login' | 'registro';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly pestana = signal<Pestana>('login');
  readonly error = signal('');

  // Login
  correoLogin = 'jgarcia@misena.edu.co';
  passwordLogin = 'Sena2025*';

  // Registro
  nombreRegistro = '';
  correoRegistro = '';
  programaRegistro = '';
  passwordRegistro = '';

  cambiarPestana(p: Pestana): void {
    this.pestana.set(p);
    this.error.set('');
  }

  enviarLogin(): void {
    const ok = this.auth.iniciarSesion(this.correoLogin, this.passwordLogin);
    if (ok) {
      this.router.navigate(['/inicio']);
    } else {
      this.error.set('Correo o contraseña incorrectos. Usa las credenciales de prueba.');
    }
  }

  enviarRegistro(): void {
    if (!this.nombreRegistro || !this.correoRegistro || !this.passwordRegistro) {
      this.error.set('Completa todos los campos obligatorios.');
      return;
    }
    if (this.passwordRegistro.length < 8) {
      this.error.set('La contraseña debe tener mínimo 8 caracteres.');
      return;
    }
    this.auth.registrar({
      nombre: this.nombreRegistro,
      correo: this.correoRegistro,
      programa: this.programaRegistro,
      contrasena: this.passwordRegistro
    });
    this.router.navigate(['/inicio']);
  }
}
