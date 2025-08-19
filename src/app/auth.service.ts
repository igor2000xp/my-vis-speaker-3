import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);

  constructor() { }

  login() {
    // Placeholder for login logic
    console.log('Login method called');
  }

  register() {
    // Placeholder for registration logic
    console.log('Register method called');
  }

  logout() {
    // Placeholder for logout logic
    console.log('Logout method called');
  }
}