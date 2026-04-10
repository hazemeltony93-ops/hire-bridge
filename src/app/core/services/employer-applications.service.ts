import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap, timeout } from 'rxjs/operators';

import { CompanyService } from './company.service';

export interface EmployerApplicant {
  id: string;
  jobId: string;
  candidateName: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  source?: 'mock' | 'api';
}

const MOCK_APPLICANTS: EmployerApplicant[] = [
  { id: 'app-001', jobId: 'job-001', candidateName: 'Omar Ali', email: 'omar@example.com', status: 'pending', appliedAt: '2026-04-08T09:00:00.000Z', source: 'mock' },
  { id: 'app-002', jobId: 'job-001', candidateName: 'Mariam Samy', email: 'mariam@example.com', status: 'accepted', appliedAt: '2026-04-07T11:30:00.000Z', source: 'mock' },
  { id: 'app-003', jobId: 'job-001', candidateName: 'Nada Hossam', email: 'nada@example.com', status: 'rejected', appliedAt: '2026-04-05T15:00:00.000Z', source: 'mock' },
  { id: 'app-004', jobId: 'job-002', candidateName: 'Ahmed Tarek', email: 'ahmed@example.com', status: 'pending', appliedAt: '2026-04-06T10:15:00.000Z', source: 'mock' },
  { id: 'app-005', jobId: 'job-002', candidateName: 'Sara Emad', email: 'sara@example.com', status: 'pending', appliedAt: '2026-04-04T12:45:00.000Z', source: 'mock' },
  { id: 'app-006', jobId: 'job-003', candidateName: 'Youssef Nabil', email: 'youssef@example.com', status: 'accepted', appliedAt: '2026-04-03T13:20:00.000Z', source: 'mock' }
];

@Injectable({
  providedIn: 'root'
})
export class EmployerApplicationsService {
  private readonly baseUrl = 'http://localhost:3004';
  private applicants = [...MOCK_APPLICANTS];

  constructor(
    private http: HttpClient,
    private companyService: CompanyService
  ) {}

  getApplicantsByJob(jobId: string): Observable<EmployerApplicant[]> {
    return this.http.get<any>(`${this.baseUrl}/job/get-shortListed-Of-Company/${jobId}`).pipe(
      timeout(4000),
      map(response => {
        const list = this.extractArray(response);
        if (!list.length) {
          return this.applicants.filter(applicant => applicant.jobId === jobId);
        }

        return list.map((item: any, index: number) => this.mapApplicant(item, jobId, index));
      }),
      catchError(() => of(this.applicants.filter(applicant => applicant.jobId === jobId)).pipe(delay(200)))
    );
  }

  updateDecision(applicantId: string, status: EmployerApplicant['status']): Observable<EmployerApplicant> {
    const applicant = this.applicants.find(item => item.id === applicantId);

    if (!applicant) {
      return throwError(() => new Error('Applicant not found.'));
    }

    const companyId = localStorage.getItem('companyId');
    const action = status === 'accepted' ? 'approved' : 'rejected';

    if (!companyId) {
      return throwError(() => new Error('Company profile is not linked yet. Complete company setup first.'));
    }

    return this.companyService.acceptOrRejectEmployer(companyId, applicantId, action).pipe(
      tap(() => {
        applicant.status = status;
      }),
      map(() => ({ ...applicant, status, source: applicant.source })),
      catchError(() => {
        applicant.status = status;
        return of({ ...applicant, status });
      })
    );
  }

  getAllApplicants(): Observable<EmployerApplicant[]> {
    const companyId = localStorage.getItem('companyId');

    if (!companyId) {
      return of([...this.applicants]).pipe(delay(150));
    }

    return this.companyService.getPendingForCompany(companyId).pipe(
      timeout(4000),
      map(response => {
        const list = this.extractArray(response);
        if (!list.length) {
          return [...this.applicants];
        }

        return list.map((item: any, index: number) => this.mapApplicant(item, item?.jobId || `job-live-${index}`, index));
      }),
      catchError(() => of([...this.applicants]).pipe(delay(150)))
    );
  }

  private extractArray(response: any): any[] {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.applicants)) return response.data.applicants;
    if (Array.isArray(response?.applicants)) return response.applicants;
    if (Array.isArray(response?.shortlistedCandidates)) return response.shortlistedCandidates;
    if (Array.isArray(response?.shortListedCandidates)) return response.shortListedCandidates;
    if (Array.isArray(response?.pendingList)) return response.pendingList;
    if (Array.isArray(response?.data?.pendingList)) return response.data.pendingList;
    return [];
  }

  private mapApplicant(item: any, jobId: string, index: number): EmployerApplicant {
    return {
      id: item?._id || item?.id || item?.applicantId || `api-app-${jobId}-${index}`,
      jobId,
      candidateName: item?.candidateName || item?.name || item?.fullName || item?.firstName || item?.email?.split('@')[0] || 'Candidate',
      email: item?.email || item?.candidateEmail || 'unknown@example.com',
      status: this.normalizeStatus(item?.status),
      appliedAt: item?.createdAt || item?.appliedAt || new Date().toISOString(),
      source: 'api'
    };
  }

  private normalizeStatus(value: any): EmployerApplicant['status'] {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === 'accepted' || normalized === 'approved') return 'accepted';
    if (normalized === 'rejected' || normalized === 'declined') return 'rejected';
    return 'pending';
  }
}
