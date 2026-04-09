import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

// 🔥 بدل AuthService
import { CompanyService } from '../../../core/services/company.service';

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
  size: number | null = null;
  budgetRange: number | null = null;
  website = '';
  logo = '';

  loading = false;
  errorMsg = '';
  touched: any = {};

  constructor(
    private company: CompanyService, // ✅ هنا التعديل
    private router: Router
  ) {}

  isEmpty(value: any) {
    return value === null || value === undefined || value.toString().trim() === '';
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

  // 🚀 SUBMIT
  submit() {

    this.errorMsg = '';

    if (!this.isValid()) {
      this.markAllTouched();
      return;
    }

    const payload = {
      name: this.name,
      CompanyEmail: this.CompanyEmail.toLowerCase(),
      industry: this.industry,
      website: this.website,
      logo: this.logo || 'https://test.com/logo.png',
      role: 'employer',

      employerProfile: {
        EmployerCompanyName: this.name,
        companySize: this.size,
        budgetRange: this.budgetRange
      }
    };

    console.log('FINAL PAYLOAD 👉', payload);

    this.loading = true;

    // 🔥 هنا التعديل
    this.company.createCompanyProfile(payload).subscribe({

      next: (res: any) => {
        this.loading = false;

        console.log('SUCCESS 👉', res);

        localStorage.setItem('companyEmail', this.CompanyEmail);

        this.router.navigate(['/company-verify-email']);
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