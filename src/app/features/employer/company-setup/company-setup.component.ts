import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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
    private company: CompanyService,
    private router: Router
  ) {}

  isEmpty(value: any): boolean {
    return value === null || value === undefined || value.toString().trim() === '';
  }

  onBlur(field: string): void {
    this.touched[field] = true;
  }

  markAllTouched(): void {
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

  submit(): void {
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

    console.log('Company setup payload:', payload);
    this.loading = true;

    this.company.createCompanyProfile(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        console.log('Company setup response:', res);

        const companyId =
          res?.company?._id ||
          res?.company?.id ||
          res?.data?.company?._id ||
          res?.data?.company?.id ||
          res?.companyId ||
          res?.data?.companyId ||
          null;

        if (companyId) {
          localStorage.setItem('companyId', companyId);
        }

        localStorage.setItem('companyEmail', this.CompanyEmail);
        this.router.navigate(['/company-verify-email']);
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Company setup error:', err);
        this.errorMsg = err?.error?.message || 'Something went wrong.';
      }
    });
  }
}
