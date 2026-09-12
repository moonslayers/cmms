import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user';

const SESSION_KEY = 'mantia.session';

const DEMO_USER: User = {
  id: 'usr_demo_001',
  email: 'demo@mantia.app',
  nombre: 'Operador Demo',
  empresa: 'Mantia Demo SA de CV',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<User | null>(null);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  constructor() {
    this.hydrate();
  }

  async login(email: string, password: string): Promise<boolean> {
    if (email === 'demo@mantia.app' && password === 'mantia') {
      const user: User = { ...DEMO_USER };
      this.setSession(user);
      return true;
    }

    return false;
  }

  async register(payload: {
    empresa: string;
    nombre: string;
    email: string;
    password: string;
  }): Promise<boolean> {
    const user: User = {
      id: `usr_${Date.now()}`,
      email: payload.email,
      nombre: payload.nombre,
      empresa: payload.empresa,
    };
    this.setSession(user);
    return true;
  }

  logout(): void {
    this._user.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  private setSession(user: User): void {
    this._user.set(user);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    }
  }

  private hydrate(): void {
    if (typeof localStorage === 'undefined') return;
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return;
    try {
      const user: User = JSON.parse(raw);
      if (user?.id && user?.email) {
        this._user.set(user);
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }
}
