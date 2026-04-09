import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // ✅ تصحيح (styleUrls مش styleUrl)
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

      next: (res: any) => {
        this.loading = false;

        console.log('LOGIN RESPONSE 👉', res);

        // ✅ استخراج التوكن بشكل آمن
        const token = res?.token || res?.accessToken || res?.data?.token;

        if (token) {
          this.auth.saveToken(token);
          console.log('TOKEN SAVED ✅', token);

          // 🔥 تأخير بسيط يضمن إن guard يقرأ التوكن
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 50);

        } else {
          this.errorMsg = 'No token received ❌';
        }
      },

      error: (err: any) => {
        this.loading = false;

        console.error('LOGIN ERROR ❌', err);

        this.errorMsg =
          err?.error?.message || 'Login failed ❌';
      }
    });
  }
}