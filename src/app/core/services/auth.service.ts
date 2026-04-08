import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  // 👤 UPDATE PROFILE
  updateCandidateProfile(data: any) {

    const token = this.getToken();

    const headers = {
      auth: token || ''
    };

    return this.http.put(
      `${this.baseUrl}/user/updateCandidateProfile`,
      data,
      { headers }
    );
  }

  // 🔥 GET PROFILE
  getProfile() {

    const token = this.getToken();

    const headers = {
      auth: token || ''
    };

    return this.http.get(
      `${this.baseUrl}/user/profile`,
      { headers }
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