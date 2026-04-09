import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-company-setup',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './company-setup.component.html',
  styleUrls: ['./company-setup.component.css']
})
export class CompanySetupComponent {

  name = '';
  CompanyEmail = '';
  industry = '';
  size: any = '';
  budgetRange: any = '';
  website = '';
  logo = '';

  loading = false;
  errorMsg = '';
  touched: any = {};

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  isEmpty(value: any) {
    return !value || value.toString().trim() === '';
  }

  onBlur(field: string) {
    this.touched[field] = true;
  }

  markAllTouched() {
    this.touched = {
      name: true,
      CompanyEmail: true,
      industry: true,
      size: true,
      budgetRange: true,
      website: true,
      logo: true
    };
  }

  isValid(): boolean {
    return !(
      this.isEmpty(this.name) ||
      this.isEmpty(this.CompanyEmail) ||
      this.isEmpty(this.industry) ||
      this.isEmpty(this.size) ||
      this.isEmpty(this.budgetRange) ||
      this.isEmpty(this.website) ||
      this.isEmpty(this.logo)
    );
  }

  // 🔥 يخلي input أرقام بس
  allowOnlyNumbers(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  submit() {

    this.errorMsg = '';

    if (!this.isValid()) {
      this.markAllTouched();
      return;
    }

    const payload = {
      name: this.name,
      CompanyEmail: this.CompanyEmail,
      industry: this.industry,
      size: Number(this.size),
      website: this.website,
      logo: this.logo,
      role: 'employer',

      employerProfile: {
        EmployerCompanyName: this.name, // 🔥 مطابق للباك
        companySize: Number(this.size),
        budgetRange: Number(this.budgetRange)
      }
    };

    console.log('FINAL PAYLOAD 👉', payload);

    this.loading = true;

    this.auth.createCompanyProfile(payload).subscribe({

      next: (res: any) => {
        this.loading = false;
        console.log('SUCCESS 👉', res);
        this.router.navigate(['/employer/verify-email']);
      },

      error: (err: any) => {
        this.loading = false;
        console.log('ERROR 👉', err);
        this.errorMsg =
          err?.error?.message || 'Something went wrong ❌';
      }
    });
  }
}