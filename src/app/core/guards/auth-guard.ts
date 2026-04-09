import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {

    const token = this.auth.getToken();

    // ❌ مش logged in
    if (!token) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }

    // ✅ logged in
    return true;
  }
}