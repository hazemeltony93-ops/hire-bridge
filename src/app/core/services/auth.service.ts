import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3004';

  constructor(private http: HttpClient) {}

  // 🔐 AUTH
  register(data: any) {
    return this.http.post(`${this.baseUrl}/auth/signUp`, data);
  }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  // 🔑 OTP
  verifyOtp(email: string, otp: string) {
    return this.http.post(
      `${this.baseUrl}/auth/verifyOTPofPersonalEmail`,
      { email, otp }
    );
  }

  // 🔥 HEADER (المهم)
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();

    return new HttpHeaders({
      auth: token || '' // ✅ زي ما هو
    });
  }

  // ✅ 👤 GET CANDIDATE PROFILE (اضفناها بس)
  getCandidateProfile() {
    return this.http.get(
      `${this.baseUrl}/candidate/candidate-profile`,
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  // 👤 UPDATE PROFILE (سيبناه زي ما هو)
  updateCandidateProfile(data: any) {
    return this.http.put(
      `${this.baseUrl}/user/updateCandidateProfile`,
      data,
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  // 🏢 CREATE COMPANY
  createCompanyProfile(data: any) {
    return this.http.post(
      `${this.baseUrl}/company/companyProfile`,
      data,
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  // 🔥 GET PROFILE (name + email)
  getProfile() {
    return this.http.get(
      `${this.baseUrl}/user/profile`,
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  // 💾 TOKEN
  saveToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  logout() {
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}