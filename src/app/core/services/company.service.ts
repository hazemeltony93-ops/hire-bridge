import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private baseUrl = 'http://localhost:3004';

  constructor(private http: HttpClient) {}

  createCompanyProfile(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/company/companyProfile`, data);
  }

  verifyCompanyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/company/verifyCompanyEmail`, { email, otp });
  }

  getPendingForCompany(companyId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/company/getAllPendingForCompany/${companyId}`);
  }

  acceptOrRejectEmployer(companyId: string, applicantId: string, action: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/company/acceptOrRejectEmp/${companyId}`, {
      applicantId,
      action
    });
  }
}
