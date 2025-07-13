// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private mockUser = {
    userId: 1,
    userName: 'maria001@example.com',
    fullName: 'Maria Tester',
    token: 'mock-token-abc123'
  };

  login(email: string, password: string): boolean {
    // Simulate login success if email and password match mock user
    if (email === this.mockUser.userName && password === '12341234') {
      localStorage.setItem('auth', JSON.stringify(this.mockUser));
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('auth');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('auth') !== null;
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('auth') || '{}');
  }
}
