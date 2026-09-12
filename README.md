# Mantia

MVP **solo UI** (sin backend, datos mock locales) de un CMMS (gestión de mantenimiento), pensado para presentar en una reunión con clientes. Construido en Angular 22 dentro de `apps/web`.

## Stack

| Dependencia | Versión | Uso |
|---|---|---|
| Angular | ^22.0.0 | Framework (Core, Forms, Router, CDK) |
| Tailwind CSS | ^4.3.3 | Estilos CSS-first vía PostCSS |
| Spartan UI (Brain + Helm) | ^1.4.1 | Componentes headless + estilos |
| @ng-icons/lucide | ^36.0.0 | Iconografía Lucide via @ng-icons/core |
| Luxon | ^3.7.2 | Manejo de fechas |
| Vitest | ^4.0.8 | Pruebas unitarias (via @angular/build) |
| TypeScript | ~6.0.2 | Tipado estático |
| class-variance-authority | ^0.7.0 | Variantes de componentes |
| clsx + tailwind-merge | ^2.1.1 / ^3.6.0 | Composición de clases |

## Estructura del proyecto

```
cmms/
├── apps/web/                              ← Workspace Angular 22
│   ├── angular.json                       ← Configuración del proyecto "web"
│   ├── package.json                       ← Dependencias y scripts
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/                      ← Lógica transversal
│   │   │   │   ├── guards/                ← authGuard (CanActivateFn)
│   │   │   │   ├── icons.ts              ← Registro de iconos Lucide
│   │   │   │   ├── mock/                  ← Datasets mock (work-order.mock, asset.mock, etc.)
│   │   │   │   ├── models/                ← Interfaces de dominio (WorkOrder, Asset, User, etc.)
│   │   │   │   └── services/              ← AuthService, ThemeService
│   │   │   ├── shared/                    ← Componentes reutilizables
│   │   │   │   └── components/            ← PageHeader, StatCard, StatusBadge, DataTable, charts...
│   │   │   ├── layout/                    ← Shell de la aplicación
│   │   │   │   └── cmm-shell/             ← Sidebar + router-outlet (layout autenticado)
│   │   │   ├── features/                  ← Módulos del CMMS
│   │   │   │   ├── landing/               ← Página de inicio pública
│   │   │   │   ├── auth/                  ← Login y registro
│   │   │   │   ├── dashboard/             ← Panel de control con KPIs
│   │   │   │   ├── work-orders/           ← Órdenes de trabajo
│   │   │   │   ├── assets/                ← Activos y equipos
│   │   │   │   ├── preventive/            ← Mantenimiento preventivo
│   │   │   │   ├── inventory/             ← Inventario y repuestos
│   │   │   │   ├── reports/               ← Reportes
│   │   │   │   ├── technicians/           ← Técnicos
│   │   │   │   ├── locations/             ← Ubicaciones (árbol jerárquico)
│   │   │   │   └── settings/              ← Configuración
│   │   │   ├── app.routes.ts              ← Mapa de rutas completo
│   │   │   ├── app.config.ts              ← Configuración de la app
│   │   │   └── app.ts                     ← Componente raíz
│   │   └── styles.css                     ← Tokens de diseño (oklch), fuentes, tema
│   └── libs/ui/                           ← Componentes Spartan Helm (generados por CLI, editables)
│       ├── button/
│       ├── card/
│       ├── sidebar/
│       └── ... (~31 componentes instalados)
├── .agents/skills/                        ← Skills para agentes de IA
│   ├── spartan/                           ← Spartan UI (Brain/Helm) — auto-activa en repos con components.json
│   ├── spartan-sidebar-layout/            ← Composición correcta del sidebar layout
│   ├── mantia-shared-ui/                  ← Componentes compartidos (PageHeader, DataTable, charts...)
│   ├── mantia-auth-mock/                  ← Auth mock: credenciales demo, sesión en localStorage, guards
│   ├── mantia-design-tokens/              ← Tokens de color, fuentes IBM Plex, modo oscuro
│   ├── mantia-mock-data/                  ← Modelos de dominio y datasets mock locales
│   ├── angular-developer/                 ← Guías generales de Angular (signals, forms, routing...)
│   ├── frontend-design/                   ← Dirección visual y tipografía
│   └── tailwind-v4-shadcn/               ← Patrones de arquitectura CSS v4 (solo la parte CSS)
└── AGENTS.md                              ← Instrucciones para agentes de IA
```

## Requisitos

- **Node.js** >= 22
- **npm** >= 11

## Cómo ejecutar

**No hay `package.json` en la raíz.** Todos los comandos se ejecutan desde `apps/web/`:

```bash
cd apps/web

# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:4200)
npm start

# Build de producción (también ejecuta typecheck)
npm run build

# Pruebas unitarias (Vitest)
npm test -- --watch=false

# Lint
npm run lint
```

## Acceso demo

| Campo | Valor |
|---|---|
| Email | `demo@mantia.app` |
| Contraseña | `mantia` |

- El formulario de registro acepta cualquier dato y crea una sesión automáticamente.
- La sesión se persiste en `localStorage` con la clave `mantia.session`.
- La preferencia de tema se persiste en `localStorage` con la clave `mantia.theme`.

## Rutas / módulos

| Ruta | Módulo | Descripción |
|---|---|---|
| `/` | Landing | Página pública de inicio |
| `/login` | Auth | Formulario de inicio de sesión |
| `/register` | Auth | Formulario de registro |
| `/app/dashboard` | Dashboard | Panel de control con KPIs y gráficas |
| `/app/ordenes` | Work Orders | Órdenes de trabajo |
| `/app/activos` | Assets | Activos y equipos |
| `/app/preventivo` | Preventive | Mantenimiento preventivo |
| `/app/inventario` | Inventory | Inventario y repuestos |
| `/app/reportes` | Reports | Reportes |
| `/app/tecnicos` | Technicians | Técnicos |
| `/app/ubicaciones` | Locations | Ubicaciones (árbol jerárquico) |
| `/app/configuracion` | Settings | Configuración |

Todas las rutas bajo `/app` están protegidas por `authGuard` (se aplica en la ruta padre, no por ruta hija).

## Datos mock

Los modelos de dominio y datasets mock viven en `core/`:

- **`core/models/`** — Interfaces TypeScript: `WorkOrder`, `Asset`, `PreventivePlan`, `SparePart`, `Technician`, `Location`, `User`, `DashboardData`.
- **`core/mock/`** — Datasets de ejemplo con relaciones cruzadas (órdenes → activos, órdenes → técnicos, etc.).
- **No hay API** — toda la información es local y se extiende en estos archivos.

Los datos mock están referenciados entre sí (ej: el `assetTag` de una orden de trabajo coincide con el `id` de un activo). Al modificar un mock, los datos derivados (como los KPIs del dashboard) se recalculan automáticamente.

## Identidad visual

| Aspecto | Detalle |
|---|---|
| Color primario | Steel-blue (`--primary: oklch(0.48 0.09 245)`) |
| Color de acento | Ámbar (`--accent: oklch(0.78 0.15 75)`) |
| Fuentes | IBM Plex Sans (`font-sans`) / IBM Plex Mono (`font-mono`) |
| Tema | Claro (`:root`) y oscuro (`:root.dark`), alterno vía `ThemeService` |
| Tokens | Semánticos en oklch (`bg-primary`, `text-foreground`, `bg-background`, etc.) |
| Radio | `--radius: 0.625rem` |
| Utilidades de densidad | `.density-compact` y `.density-comfortable` |

## Skills del proyecto

Archivos en `.agents/skills/` con instrucciones específicas para agentes de IA:

| Skill | Cuándo usar |
|---|---|
| `spartan` | Cualquier trabajo con Spartan UI (agregar, componer, depurar, estilizar) |
| `spartan-sidebar-layout` | Componer el shell del sidebar, arreglar bugs de z-index/overlay |
| `mantia-shared-ui` | Crear/editar páginas, componer dashboards, usar DataTable/PageHeader/charts |
| `mantia-auth-mock` | Modificar login, sesión, guard, credenciales demo |
| `mantia-design-tokens` | Colores, tema, dark mode, fuentes, oklch |
| `mantia-mock-data` | Agregar/modificar modelos y datos mock |
| `angular-developer` | Guías generales de Angular (signals, forms, routing, testing, CLI) |
| `frontend-design` | Dirección visual, tipografía, estética |
| `tailwind-v4-shadcn` | Patrones de arquitectura CSS v4 (solo la parte CSS, no React/Vite) |

## Notas / limitaciones

- **Solo UI** — no hay backend. Toda la lógica de negocio es presentacional y los datos se reinician al recargar la página.
- **Sin persistencia real** — solo la sesión (`mantia.session`) y el tema (`mantia.theme`) se guardan en `localStorage`.
- **`libs/ui/**` es código generado** por el CLI de Spartan (estilos Helm copiados). Se puede editar libremente pero no es código propio del proyecto.
- **`@spartan-ng/brain`** vive en `node_modules` y no es editable.
- **Errores de lint en `libs/ui/**`** son preexistentes y aceptados (selectores `hlm-`/`brn-` generados por el CLI).
- **`npm audit`** reporta 7 vulnerabilidades high en dev-dependencies (Nx → smol-toml DoS). No requiere acción.
- **No hay script de formato** — Prettier se ejecuta manualmente (`printWidth: 100`, single quotes, parser angular para HTML).
