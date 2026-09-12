---
name: mantia-mock-data
description: Mantia's domain models and local mock datasets — types, exports, relationships, and how to extend. Trigger on: models, mock data, MOCK_, WorkOrder, Asset, PreventivePlan, SparePart, Technician, Location, DashboardData, KPI, extending mock, cross-references.
---

# Mantia Mock Data

Models in `core/models/*.ts`, mock datasets in `core/mock/*.ts`. All data is local — no API.

## Models (`core/models/index.ts` → barrel export)

| File | Interface | Key fields |
|---|---|---|
| `work-order.ts` | `WorkOrder` | `assetTag`, `tecnicoAsignado`, `estado` (5 states), `prioridad` (4 levels), `tipo`, `repuestosUsados[]` |
| `asset.ts` | `Asset` | `id` (the tag), `categoria` (10 types), `estado`, `criticidad` |
| `preventive-plan.ts` | `PreventivePlan` | `assetTag`, `frecuencia` (string unions OR `number` for days), `tecnico` |
| `spare-part.ts` | `SparePart` | `sku` (PK), `stockActual`/`stockMinimo`, `categoria` (10 types) |
| `technician.ts` | `Technician` | `nombre`, `especialidad` (8 types), `disponibilidad`, `cargaTrabajo` |
| `location.ts` | `Location` | `tipo` (`planta`/`área`/`ubicación`), `parentId` (tree) |
| `dashboard-kpi.ts` | `DashboardData`, `DashboardKpis`, `KpiValue`, `ChartSeries` | Aggregate KPI + chart shapes |
| `user.ts` | `User` | `rol?` (`admin`/`supervisor`/`técnico`/`visor`) |

All string-literal unions are in Spanish.

## Mock exports (`core/mock/index.ts`)

| Export | Count | Source file |
|---|---|---|
| `MOCK_WORK_ORDERS` | 14 | `work-order.mock.ts` |
| `MOCK_ASSETS` | 12 | `asset.mock.ts` |
| `MOCK_PREVENTIVE_PLANS` | 9 | `preventive-plan.mock.ts` |
| `MOCK_SPARE_PARTS` | 13 | `spare-part.mock.ts` |
| `MOCK_TECHNICIANS` | 6 | `technician.mock.ts` |
| `MOCK_LOCATIONS` | 11 | `location.mock.ts` |
| `MOCK_USER` | 1 | `user.mock.ts` |
| `MOCK_DASHBOARD_DATA` | computed | `dashboard.mock.ts` |
| `MOCK_RECENT_WORK_ORDERS` | ≤5 | `dashboard.mock.ts` |
| `MOCK_UPCOMING_PREVENTIVE` | ≤5 | `dashboard.mock.ts` |
| `MOCK_LOW_STOCK_PARTS` | dynamic | `dashboard.mock.ts` |

## Relationships & invariants

- **Work orders → assets**: `assetTag` matches an `Asset.id` (e.g. `EQ-BOM-01`).
- **Work orders → technicians**: `tecnicoAsignado` matches a `Technician.nombre` (e.g. `'Carlos Mendoza'`).
- **Work orders → spare parts**: `repuestosUsados[]` entries are `SparePart.sku` values (e.g. `'SP-ROD-6205'`).
- **Preventive plans → assets**: `assetTag` matches an `Asset.id`.
- **Preventive plans → technicians**: `tecnico` matches a `Technician.nombre`.
- **Locations**: tree via `parentId`. Roots have `parentId: null` (planta), children reference parent id. Depth ≤ 3: planta → área → ubicación.
- **Dates**: all ISO 8601 around 2026 (Aug–Oct range).
- **Dashboard data**: KPIs and charts are computed from the other mock arrays, not hardcoded — changing a work order changes the dashboard.

## How to extend

1. Add entry to the relevant mock file (keep type imports from `../models`).
2. If it's a new entity, create a model in `core/models/` and re-export from `index.ts`.
3. Maintain cross-references: new work order `assetTag` must match an existing asset, `tecnicoAsignado` a technician name, `repuestosUsados` valid SKUs.
4. For dashboard aggregates: they auto-compute — just ensure the source arrays are correct.
