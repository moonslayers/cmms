---
name: spartan-sidebar-layout
description: >-
  Correctly composing the Spartan Helm sidebar layout in this repo. Trigger when
  building or editing a shell layout, adding sidebar navigation, fixing sidebar
  z-index or overlay bugs, or working with hlm-sidebar, hlmSidebarWrapper,
  hlmSidebarInset, or hlmSidebarTrigger.
---

# Spartan Sidebar Layout Contract

Canonical reference: `apps/web/src/app/layout/cmm-shell/cmm-shell.html`.

## The wrapper is mandatory

`<div hlmSidebarWrapper>` must wrap **both** the sidebar and the main content. The wrapper directive (`libs/ui/sidebar/src/lib/hlm-sidebar-wrapper.ts`) sets the CSS custom properties inline:

- `--sidebar-width: 16rem` (default from `hlm-sidebar.token.ts`)
- `--sidebar-width-icon: 3rem`

Without the wrapper, `--sidebar-width` resolves to `0`, so the sidebar gap (`w-(--sidebar-width)`) collapses. Meanwhile the sidebar container is `fixed inset-y-0 z-10`, so it floats over the content.

**Symptom → cause:**
- "sidebar covers content" → missing `hlmSidebarWrapper` and/or missing `main[hlmSidebarInset]`

## Correct composition

```html
<div hlmSidebarWrapper>
  <hlm-sidebar side="left" collapsible="offcanvas">
    <!-- header, content, footer -->
  </hlm-sidebar>

  <main hlmSidebarInset>
    <header>...</header>
    <section>
      <router-outlet />
    </section>
  </main>
</div>
```

## Sidebar internals

Ordered child elements: `hlm-sidebar-header`, `hlm-sidebar-content`, `hlm-sidebar-footer`. Inside content: `hlm-sidebar-group` → `hlm-sidebar-group-label` + `hlm-sidebar-group-content` → `hlm-sidebar-menu` → `hlm-sidebar-menu-item` → `hlm-sidebar-menu-button`.

## Inputs

| Input        | Type                             | Default     |
| ------------ | -------------------------------- | ----------- |
| `collapsible`| `'offcanvas' \| 'icon' \| 'none'`| `'offcanvas'`|
| `variant`    | `'sidebar' \| 'floating' \| 'inset'`| from service |
| `side`       | `'left' \| 'right'`             | `'left'`    |

## Mobile trigger — do NOT hand-roll

Use a single `<button hlmSidebarTrigger>` (selector `button[hlmSidebarTrigger]`). It calls `HlmSidebarService.toggleSidebar()` which branches:
- **Mobile** (`isMobile` signal, breakpoint `768px`): toggles `_openMobile` → opens the sheet overlay.
- **Desktop**: toggles `_open` → collapses/expands the sidebar.

Do **not** create a separate `mobileMenuOpen` signal or a custom hamburger button — that duplicates the service logic and produces dead code. The trigger is visible at all breakpoints; the service handles the rest.

## Gotchas

- The sidebar gap div (`data-slot="sidebar-gap"`) only exists in the `hlm-sidebar` template for `collapsible !== 'none'` on desktop. It renders `w-(--sidebar-width)` which relies on the wrapper's CSS var.
- `HlmSidebarInset` selector is `main[hlmSidebarInset]` (element + attribute). Using `<div hlmSidebarInset>` will not match.
- State is persisted in a cookie (`sidebar_state`). The service restores it on construction.
