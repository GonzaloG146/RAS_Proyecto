# RAS · Red de Apoyo SENA (prototipo Angular)

Prototipo funcional en **Angular 17 (standalone components) + TypeScript**, construido a partir del
diseño de Figma y el mapa de navegación de la plataforma **RAS – Red de Apoyo SENA**, una app de
trueque y donación entre aprendices SENA.

> Este proyecto es un **prototipo de front-end**: usa datos simulados (mock) mantenidos en memoria con
> Angular Signals. No hay backend ni base de datos real; al recargar la página los datos vuelven a su
> estado inicial (excepto la sesión, que persiste en `localStorage` del navegador).

---

## 🚀 Cómo ejecutar el proyecto

Requisitos: [Node.js](https://nodejs.org/) 18 o superior y npm.

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar servidor de desarrollo
npm start
# equivalente a: ng serve

# 3. Abrir en el navegador
http://localhost:4200
```

Para compilar una versión de producción:

```bash
npm run build
```

Los archivos compilados quedan en `dist/ras-angular/`.

---

## 🔑 Credenciales de acceso (mock)

En la pantalla de **Iniciar sesión** ya aparecen pre-cargadas:

| Campo       | Valor                     |
|-------------|---------------------------|
| Correo      | `jgarcia@misena.edu.co`   |
| Contraseña  | `Sena2025*`                |

También puedes usar la pestaña **Registrarse** para crear una cuenta nueva (mock): quedarás
autenticado automáticamente con los datos que ingreses.

---

## 🗺️ Mapa de navegación implementado

```
Landing (pública)
  └─ Iniciar sesión / Registrarse ──► Inicio
                                         │
        ┌────────────┬────────────┬─────┼─────────────┬────────────────┬────────┐
        ▼            ▼            ▼     ▼             ▼                ▼        ▼
    Mi perfil   Mis           Mis     Mensajes    Notificaciones      PQR
                publicaciones trueques
```

Barra superior (accesible desde cualquier pantalla privada): **Mi perfil · Notificaciones ·
Ayuda/Soporte · Cerrar sesión**.

### Pantallas principales
| Ruta                  | Descripción |
|-----------------------|-------------|
| `/`                   | Landing pública: hero, estadísticas, publicaciones recientes, cómo funciona RAS |
| `/login`              | Iniciar sesión / Registrarse (tabs) |
| `/inicio`             | Dashboard autenticado: bienvenida, estadísticas, publicaciones recientes |
| `/mi-perfil`          | Datos del aprendiz, calificaciones recibidas, editar perfil (modal), radicar PQR |
| `/mis-publicaciones`  | Gestión de publicaciones propias: filtros, nueva publicación (modal), ver propuestas (modal) |
| `/mis-trueques`       | Seguimiento de trueques con stepper de 5 pasos, subir evidencia (modal), cancelar |
| `/mensajes`           | Chat en tiempo real (mock) con lista de conversaciones y perfil del contacto (modal) |
| `/notificaciones`     | Centro de notificaciones con navegación contextual a la pantalla relacionada |
| `/pqr`                | Radicar nueva PQR y consultar histórico, con panel informativo |

### Modales / pantallas emergentes
- Editar perfil (`Mi perfil`)
- Nueva publicación (`Mis publicaciones`)
- Ver propuestas recibidas (`Mis publicaciones`)
- Subir evidencia del trueque (`Mis trueques`) — incluye vista de confirmación
- Perfil del chat (`Mensajes`)

---

## 🏗️ Arquitectura del proyecto

```
src/app/
├── core/
│   ├── models/          # Interfaces TypeScript (Usuario, Publicacion, Trueque, ...)
│   ├── services/        # Servicios con Angular Signals (estado global + lógica mock)
│   ├── guards/           # authGuard funcional para rutas privadas
│   └── mock-data.ts      # Datos simulados centralizados
├── shared/
│   └── components/       # Componentes reutilizables: Navbar, Sidebar, Modal, Badge, StatCard...
├── features/
│   ├── landing/           # Página pública
│   ├── auth/               # Login / Registro
│   ├── inicio/             # Dashboard
│   ├── mi-perfil/
│   ├── mis-publicaciones/
│   ├── mis-trueques/
│   ├── mensajes/
│   ├── notificaciones/
│   └── pqr/
├── app.routes.ts          # Definición de rutas (con lazy loading por pantalla)
├── app.config.ts          # Configuración standalone (router, animaciones)
└── app.component.ts        # Componente raíz
```

**Decisiones técnicas clave:**
- **Standalone components** (sin NgModules) — estilo recomendado desde Angular 17.
- **Angular Signals** para el estado (usuario autenticado, publicaciones, trueques, mensajes,
  notificaciones, PQR) en vez de RxJS/Store, ideal para un prototipo simple y reactivo.
- **Lazy loading** de cada pantalla vía `loadComponent` en las rutas.
- **Layout privado** (`PrivateLayoutComponent`) que envuelve Navbar + Sidebar + `<router-outlet>`
  para todas las pantallas autenticadas; la Landing y el Login se muestran sin este layout.
- **Componentes reutilizables**: `ModalComponent` (shell genérico con cabecera verde para todos los
  modales), `BadgeComponent` (mapea automáticamente el color según el texto de estado), `StatCardComponent`.
- **Responsive**: sidebar colapsable en mobile/tablet (drawer con overlay), grillas que pasan de
  3-4 columnas a 1-2 columnas, chat de mensajes que alterna entre lista y conversación en pantallas
  angostas.

---

## 🎨 Paleta de diseño (extraída del Figma)

| Uso                        | Color       |
|-----------------------------|-------------|
| Verde institucional oscuro (topbar/sidebar) | `#0d351e` |
| Verde primario (botones, links) | `#1a6b3c` |
| Fondo de página (crema)     | `#f5f5ef`   |
| Badges Trueque / En curso   | azul `#dbeafe` / `#1d4ed8` |
| Badges Donación / Negociando| ámbar `#fef3c7` / `#b45309` |
| Badges Activa / Completado  | verde `#dcfce7` / `#15803d` |
| Badges Cancelado            | rojo `#fee2e2` / `#b91c1c` |

Variables definidas en `src/styles.scss` (`:root`), usadas en toda la app.

---

## ⚠️ Notas del prototipo
- No se implementó backend: toda la persistencia de datos de negocio vive en memoria durante la
  sesión del navegador (los Signals se reinician al recargar). Solo la sesión de usuario persiste
  en `localStorage`.
- Los formularios no tienen validación exhaustiva; se priorizó fidelidad visual y flujo de
  navegación completo según el mapa proporcionado.
- Las imágenes ilustrativas del Figma (personas intercambiando una caja) se recrearon como SVG
  simplificado, ya que no se contó con los assets originales exportables.
