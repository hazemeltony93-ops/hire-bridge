import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  loading = false;
  errorMsg = '';
  touched: any = {};

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  isEmpty(value: string): boolean {
    return !value || value.trim() === '';
  }

  onBlur(field: string): void {
    this.touched[field] = true;
  }

  isValid(): boolean {
    return !this.isEmpty(this.email) && !this.isEmpty(this.password);
  }

  submit(): void {
    this.errorMsg = '';

    if (!this.isValid()) {
      this.touched = { email: true, password: true };
      return;
    }

    this.loading = true;

    this.auth.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        this.loading = false;

        localStorage.removeItem('role');

        const token = res?.token || res?.accessToken || res?.data?.token;
        const responseRole =
          res?.user?.role ||
          res?.data?.user?.role ||
          res?.role ||
          null;

        if (!token) {
          this.errorMsg = 'No token received.';
          return;
        }

        this.auth.saveToken(token);
        const tokenRole = this.auth.getUserFromToken()?.role || null;
        const finalRole = responseRole || tokenRole || 'candidate';

        localStorage.setItem('role', finalRole);

        localStorage.removeItem('allowChooseRole');

        const targetRoute = finalRole === 'employer'
          ? '/employer/dashboard'
          : '/dashboard';

        this.router.navigate([targetRoute], { replaceUrl: true });
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Login failed.';
      }
    });
  }
}
