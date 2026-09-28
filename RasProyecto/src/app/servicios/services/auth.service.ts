import { Injectable, computed, signal } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { USUARIO_ACTUAL } from '../mock-data';

const STORAGE_KEY = 'ras_auth_usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _usuario = signal<Usuario | null>(this.recuperarSesion());

  readonly usuario = this._usuario.asReadonly();
  readonly estaAutenticado = computed(() => this._usuario() !== null);

  /** Intenta iniciar sesión contra el usuario mock. Devuelve true si es correcto. */
  iniciarSesion(correo: string, contrasena: string): boolean {
    const correoOk = correo.trim().toLowerCase() === USUARIO_ACTUAL.correo.toLowerCase();
    const passOk = contrasena === USUARIO_ACTUAL.contrasena;
    if (correoOk && passOk) {
      this._usuario.set(USUARIO_ACTUAL);
      this.guardarSesion(USUARIO_ACTUAL);
      return true;
    }
    return false;
  }

  /** Registra un nuevo aprendiz (mock): crea el usuario y lo autentica automáticamente. */
  registrar(datos: { nombre: string; correo: string; programa: string; contrasena: string }): boolean {
    const nuevoUsuario: Usuario = {
      ...USUARIO_ACTUAL,
      id: 'u-' + Date.now(),
      nombre: datos.nombre || USUARIO_ACTUAL.nombre,
      correo: datos.correo || USUARIO_ACTUAL.correo,
      programa: datos.programa || USUARIO_ACTUAL.programa,
      contrasena: datos.contrasena || USUARIO_ACTUAL.contrasena,
      iniciales: this.calcularIniciales(datos.nombre || USUARIO_ACTUAL.nombre),
      totalTrueques: 0,
      totalArticulos: 0,
      rating: 0,
      totalResenas: 0
    };
    this._usuario.set(nuevoUsuario);
    this.guardarSesion(nuevoUsuario);
    return true;
  }

  cerrarSesion(): void {
    this._usuario.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  actualizarPerfil(cambios: Partial<Usuario>): void {
    const actual = this._usuario();
    if (!actual) return;
    const actualizado = { ...actual, ...cambios };
    this._usuario.set(actualizado);
    this.guardarSesion(actualizado);
  }

  private calcularIniciales(nombre: string): string {
    const partes = nombre.trim().split(/\s+/);
    const iniciales = partes.slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join('');
    return iniciales || 'AP';
  }

  private guardarSesion(usuario: Usuario): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
    } catch {
      /* almacenamiento no disponible: se ignora en el prototipo */
    }
  }

  private recuperarSesion(): Usuario | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Usuario) : null;
    } catch {
      return null;
    }
  }
}
