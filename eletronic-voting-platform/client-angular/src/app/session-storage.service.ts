import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  private readonly USER_UUID_KEY = 'user_uuid';
  private readonly USER_EMAIL_KEY = 'user_email';

  setUserDetails(uuid: string, email: string): void {
    sessionStorage.setItem(this.USER_UUID_KEY, uuid);
    sessionStorage.setItem(this.USER_EMAIL_KEY, email);
  }

  getUserUuid(): string | null {
    return sessionStorage.getItem(this.USER_UUID_KEY);
  }

  getUserEmail(): string | null {
    return sessionStorage.getItem(this.USER_EMAIL_KEY);
  }

  clearUserDetails(): void {
    sessionStorage.removeItem(this.USER_UUID_KEY);
    sessionStorage.removeItem(this.USER_EMAIL_KEY);
  }

  clear(): void {
    sessionStorage.clear();
  }
}
