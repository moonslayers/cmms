import { Injectable, signal, inject, DOCUMENT } from '@angular/core';

const THEME_KEY = 'mantia.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _document = inject(DOCUMENT);

  readonly isDark = signal(false);

  constructor() {
    if (typeof localStorage !== 'undefined' && typeof document !== 'undefined') {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'dark') {
        this.isDark.set(true);
        this._document.documentElement.classList.add('dark');
      }
    }
  }

  toggleTheme(): void {
    this.setTheme(!this.isDark());
  }

  setTheme(dark: boolean): void {
    this.isDark.set(dark);
    if (dark) {
      this._document.documentElement.classList.add('dark');
    } else {
      this._document.documentElement.classList.remove('dark');
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    }
  }
}
