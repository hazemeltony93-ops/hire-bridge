import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private baseUrl = 'http://localhost:3004';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      auth: this.auth.getToken() || ''
    });
  }

  // 🏢 CREATE COMPANY
  createCompanyProfile(data: any) {
    return this.http.post(
      `${this.baseUrl}/company/companyProfile`,
      data,
      {
        headers: this.getHeaders()
      }
    );
  }

  // 🏢 VERIFY COMPANY OTP
  verifyCompanyOtp(email: string, otp: string) {
    return this.http.post(
      `${this.baseUrl}/company/verifyCompanyEmail`,
      { email, otp },
      {
        headers: this.getHeaders()
      }
    );
  }
}