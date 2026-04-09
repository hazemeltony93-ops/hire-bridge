import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  private baseUrl = 'http://localhost:3004';

  constructor(private http: HttpClient) {}

  // 🔥 GET PROFILE
  getCandidateProfile() {
    return this.http.get(`${this.baseUrl}/candidate/candidate-profile`);
  }

  // 🔥 UPDATE PROFILE
  updateCandidateProfile(data: any) {
    return this.http.put(`${this.baseUrl}/user/updateCandidateProfile`, data);
  }
}