import { Injectable } from '@angular/core';

export enum LocalStorageKeys {
    ACCESS_TOKEN = 'jfk_acc_tkn',
    SIDEBAR_STATE_KEY = 'sidebarCollapsed'
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public getLocalStorageItem<T>(key: LocalStorageKeys): T | null {
    const item = globalThis.localStorage?.getItem(key);
    try {
      return item ? JSON.parse(item) : null;
    } catch {
      return item as T;
    }
  }

  public setLocalStorageItem(key: LocalStorageKeys, data: unknown): void {
    globalThis.localStorage?.setItem(key, JSON.stringify(data));
  }

  public removeLocalStorageItem(key: LocalStorageKeys): void {
    globalThis.localStorage?.removeItem(key);
  }
}
