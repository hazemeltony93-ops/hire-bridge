import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
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

  isEmpty(value: string) {
    return !value || value.trim() === '';
  }

  onBlur(field: string) {
    this.touched[field] = true;
  }

  isValid(): boolean {
    return !this.isEmpty(this.email) && !this.isEmpty(this.password);
  }

  submit() {

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

      // 🔥 الحل هنا
      next: (res: any) => {
        this.loading = false;

        console.log('LOGIN RESPONSE 👉', res);

        // ✅ save token
        if (res?.token) {
          this.auth.saveToken(res.token);
        }

        this.router.navigate(['/dashboard']);
      },

      error: (err: any) => {
        this.loading = false;

        this.errorMsg =
          err?.error?.message || 'Login failed ❌';
      }
    });
  }
}