# Known issues & quirks

Known limitations in `@spartan-ng/brain` or Helm that are **not fixable by editing Helm files**.
Documented here to prevent repeated investigation.

## BrnTooltip: `TemplateRef` context is silently dropped

**Component:** `BrnTooltip` / `BrnTooltipContent` (used by `HlmTooltip`).

**Type signature:** `BrnTooltipType = string | TemplateRef<void> | null`

**Behavior:** When you pass a `TemplateRef` as tooltip content (e.g. `[hlmTooltip]="myTemplate"` or
`brnTooltip`), `BrnTooltipContent` renders the template via `*brnTooltipStringTemplateOutlet`
**without passing any context**. The input `brnTooltipStringTemplateOutletContext` exists but is
never wired — `BrnTooltipContent` never sets it and `BrnTooltip` does not expose a way to pass it.

**Symptom:** Any `let-x` variable declared in the anchored `<ng-template>` (e.g.
`let-item="$implicit"`) receives `undefined`. At runtime this throws:
`TypeError: can't access property "...", x is undefined`.

**Workaround — use signals + `@if` guard (recommended):**

```ts
// component
activeItem = signal<Item | null>(null);
tooltipContent = computed(() => this.activeItem());
```

```html
<!-- trigger element, e.g. on hover/pointer event sets activeItem() -->
<div
  [hlmTooltip]="tooltipTpl"
  (mouseenter)="activeItem.set(item)"
  (mouseleave)="activeItem.set(null)"
>
  ...
</div>

<!-- template: read the signal directly, never use let- -->
<ng-template #tooltipTpl>
  @if (tooltipContent(); as item) {
    <span>{{ item.name }}</span>
  }
</ng-template>
```

**Alternatives:**
- Pass a plain `string` to `[hlmTooltip]` — works, but loses rich content.
- Use a separate overlay/popover component if you need full context control.

**Do not** patch `node_modules/@spartan-ng/brain` — Brain is an npm dependency; edits are lost on
install.

## provideSpartanHlm() required for overlay config

Components that rely on Angular CDK overlay (`dialog`, `sheet`, `alert-dialog`, `popover`,
`hover-card`, `tooltip`, menus) need `provideSpartanHlm()` in the application provider tree to
configure the overlay. If overlay-based components fail silently or render outside the viewport,
check that `provideSpartanHlm()` is present in `app.config.ts`.
