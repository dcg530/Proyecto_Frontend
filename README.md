# Proyecto_Frontend

# Frontend - Sistema de Triage Inteligente

Este es el frontend del **Sistema de Triage Inteligente**, desarrollado con **Angular 19**.  
Permite gestionar pacientes, realizar triage, validaciones y consultar reportes.

---

#  Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

| Herramienta | Versión | Descarga |
|---|---|---|
| Node.js | v18.x o superior | <https://nodejs.org> |
| npm | v9.x o superior | (viene con Node.js) |
| Angular CLI | v19.x | `npm install -g @angular/cli` |
| Git | (opcional) | <https://git-scm.com> |

## Verificar instalaciones

```powershell
node --version
npm --version
ng version
```

---

# Instalación paso a paso

## 1. Clonar o descargar el proyecto

```powershell
# Si tienes Git instalado
git clone <URL_DEL_REPOSITORIO>

# O descarga el ZIP y extrae la carpeta
```

## 2. Acceder a la carpeta del proyecto

```powershell
cd triage-frontend
```

## 3. Instalar dependencias

```powershell
npm install
```

Este proceso puede tomar varios minutos la primera vez.

---

## 4. Configurar variables de entorno (si es necesario)

Edita el archivo:

```text
src/environments/environment.ts
```

Para ajustar la URL del backend:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7252/api',
  signalRUrl: 'https://localhost:7252/hubs/triage',
  appName: 'Triage Inteligente - Sanitas'
};
```

---

# Ejecutar el proyecto

## 🔹 Modo desarrollo (con recarga automática)

```powershell
ng serve
```

Luego abre tu navegador en:

```text
http://localhost:4200
```

---

## 🔹 Modo desarrollo en red local (acceso desde otros dispositivos)

```powershell
ng serve --host 0.0.0.0
```

---

## 🔹 Compilar para producción

```powershell
ng build --prod
```

Los archivos se generarán en la carpeta:

```text
dist/
```

---

# Credenciales de acceso

Una vez que el backend esté corriendo, usa estas credenciales para probar:

| Usuario | Contraseña | Rol | Redirección |
|---|---|---|---|
| enfermero | 123456 | Enfermero | `/enfermeria/validacion` |
| admin | admin123 | Administrador | `/admin/dashboard` |
| kiosco | Kiosco123 | Kiosco | `/kiosco` |

---

# Estructura del proyecto

```text
triage-frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   ├── features/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── enfermeria/
│   │   │   ├── historial/
│   │   │   ├── kiosco/
│   │   │   ├── pacientes/
│   │   │   ├── reportes/
│   │   │   ├── triage/
│   │   │   └── configuracion/
│   │   └── shared/
│   ├── assets/
│   └── environments/
├── angular.json
├── package.json
└── tsconfig.json
```

---

# Solución de problemas comunes

## Error: `@angular/build version mismatch`

### Solución

```powershell
npm install @angular/core@19 @angular/common@19 @angular/compiler@19
npm install @angular-devkit/build-angular@19
```

---

## Error: Puerto 4200 ya está en uso

### Solución

```powershell
ng serve --port 4300
```

---

## Error: No se puede conectar con el backend

### Solución

- Verificar que el backend esté corriendo en `https://localhost:7252`
- Verificar la variable `apiUrl` en `environment.ts`
- Deshabilitar la verificación SSL en el navegador (solo desarrollo)

---

## Error: `ng` no es reconocido como comando

### Solución

```powershell
npm install -g @angular/cli@19
```

---

# Dependencias principales

| Paquete | Versión | Uso |
|---|---|---|
| @angular/core | 19.x | Framework principal |
| @microsoft/signalr | 8.x | Comunicación en tiempo real |
| bootstrap | 5.x | Estilos y componentes UI |
| ngx-toastr | 18.x | Notificaciones |
| bootstrap-icons | 1.x | Íconos |

---

# Rutas principales del sistema

| Ruta | Descripción |
|---|---|
| `/login` | Inicio de sesión |
| `/kiosco` | Interfaz pública del kiosco |
| `/triage/inicio` | Inicio de triage (enfermero) |
| `/triage/sala-espera` | Visualización de cola |
| `/enfermeria/validacion` | Panel de validación (enfermero) |
| `/pacientes` | Gestión de pacientes (admin) |
| `/admin/dashboard` | Dashboard administrador |
| `/admin/reglas` | Configuración de reglas |
| `/admin/reportes` | Reportes y estadísticas |

---

# Checklist para ejecutar correctamente

- [ ] Node.js instalado (v18+)
- [ ] Angular CLI instalado (v19)
- [ ] Backend ejecutándose en `https://localhost:7252`
- [ ] Dependencias instaladas (`npm install`)
- [ ] Variables de entorno configuradas
- [ ] `ng serve` ejecutado correctamente

---

# Soporte

Para cualquier problema:

- Revisar los logs en la consola del navegador:
  - `F12 → Consola`
- Revisar la terminal donde se ejecuta:

```powershell
ng serve
```

---

## Tecnologías utilizadas

- Angular 19
- TypeScript
- Bootstrap 5
- SignalR
- RxJS
- Angular Router
- Angular Forms

---

## Licencia

Proyecto desarrollado para fines académicos y/o institucionales.