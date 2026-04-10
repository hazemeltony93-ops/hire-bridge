import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';


export interface EmployerJob {
  id: string;
  title: string;
  description: string;
  salary: number;
  type: string;
  category?: string;
  skillsRequired?: string[];
  experienceLevel?: string;
  minExperience?: string;
  location: string;
  createdAt: string;
  applicantsCount: number;
  openRoles: number;
  source?: 'mock' | 'api';
}

export interface EmployerJobPayload {
  title: string;
  category: string;
  description: string;
  skillsRequired: string[];
  experienceLevel: string;
  minExperience: string;
  budget: {
    min: string;
    max: string;
  };
  workType: string;
}

const MOCK_JOBS: EmployerJob[] = [
  {
    id: 'job-001',
    title: 'Frontend Angular Engineer',
    description: 'Own the employer experience and shipping dashboards with Angular.',
    salary: 18000,
    type: 'Full Time',
    category: 'Engineering',
    skillsRequired: ['Angular', 'TypeScript'],
    experienceLevel: 'Senior',
    minExperience: '3',
    location: 'Cairo, Hybrid',
    createdAt: '2026-04-01T10:00:00.000Z',
    applicantsCount: 18,
    openRoles: 2,
    source: 'mock'
  },
  {
    id: 'job-002',
    title: 'Technical Recruiter',
    description: 'Screen candidates and coordinate hiring loops with engineering teams.',
    salary: 14000,
    type: 'Remote',
    category: 'Recruitment',
    skillsRequired: ['Screening', 'ATS'],
    experienceLevel: 'Mid',
    minExperience: '2',
    location: 'Remote',
    createdAt: '2026-03-28T08:30:00.000Z',
    applicantsCount: 12,
    openRoles: 1,
    source: 'mock'
  },
  {
    id: 'job-003',
    title: 'Product Designer',
    description: 'Design hiring journeys, applicant views, and internal tooling experiences.',
    salary: 16000,
    type: 'Part Time',
    category: 'Design',
    skillsRequired: ['Figma', 'UX'],
    experienceLevel: 'Mid',
    minExperience: '2',
    location: 'Alexandria, Onsite',
    createdAt: '2026-03-24T14:45:00.000Z',
    applicantsCount: 9,
    openRoles: 1,
    source: 'mock'
  }
];

@Injectable({
  providedIn: 'root'
})
export class EmployerJobsService {
  private readonly baseUrl = 'http://localhost:3004';
  private readonly jobsSubject = new BehaviorSubject<EmployerJob[]>(MOCK_JOBS);

  constructor(private http: HttpClient) {}

  getJobs(): Observable<EmployerJob[]> {
    return of(this.jobsSubject.value).pipe(delay(200));
  }

  getJobById(jobId: string): Observable<EmployerJob> {
    const job = this.jobsSubject.value.find(item => item.id === jobId);

    if (!job) {
      return throwError(() => new Error('Job not found.'));
    }

    return of(job).pipe(delay(150));
  }

  createJob(payload: EmployerJobPayload): Observable<EmployerJob> {
    const companyId = localStorage.getItem('companyId');
    const localJob = this.createLocalJob(payload);

    if (!companyId) {
      return throwError(() => new Error('Company profile is not linked yet. Complete company setup first.'));
    }

    const requestBody = {
      title: payload.title,
      category: payload.category,
      description: payload.description,
      skillsRequired: payload.skillsRequired,
      experienceLevel: payload.experienceLevel,
      minExperience: payload.minExperience,
      workType: payload.workType,
      budget: payload.budget
    };

    console.log('Employer create job payload:', requestBody);
    console.log('Employer company id:', companyId);

    return this.http.post<any>(`${this.baseUrl}/job/createJob/${companyId}`, requestBody).pipe(
      tap(response => {
        console.log('Employer create job response:', response);
      }),
      map(response => this.mapApiJobResponse(response, localJob)),
      tap(job => this.prependLocalJob(job)),
      catchError(err => {
        console.error('Employer create job error:', err);
        return throwError(() => err);
      })
    );
  }

  updateJob(jobId: string, payload: EmployerJobPayload): Observable<EmployerJob> {
    let updatedJob: EmployerJob | undefined;

    const jobs = this.jobsSubject.value.map(job => {
      if (job.id !== jobId) {
        return job;
      }

      updatedJob = {
        ...job,
        title: payload.title,
        category: payload.category,
        description: payload.description,
        skillsRequired: payload.skillsRequired,
        experienceLevel: payload.experienceLevel,
        minExperience: payload.minExperience,
        salary: Number(payload.budget.min || 0),
        type: payload.workType
      };

      return updatedJob;
    });

    if (!updatedJob) {
      return throwError(() => new Error('Job not found.'));
    }

    this.jobsSubject.next(jobs);
    return of(updatedJob).pipe(delay(200));
  }

  deleteJob(jobId: string): Observable<void> {
    const job = this.jobsSubject.value.find(item => item.id === jobId);

    if (!job) {
      return throwError(() => new Error('Job not found.'));
    }

    const finishDelete = () => {
      this.jobsSubject.next(this.jobsSubject.value.filter(item => item.id !== jobId));
    };

    if (job.source === 'api') {
      return this.http.delete<void>(`${this.baseUrl}/job/delete-job/${jobId}`).pipe(
        tap(() => finishDelete()),
        catchError(() => {
          finishDelete();
          return of(void 0);
        })
      );
    }

    finishDelete();
    return of(void 0).pipe(delay(150));
  }

  private createLocalJob(payload: EmployerJobPayload): EmployerJob {
    return {
      id: `job-${Date.now()}`,
      title: payload.title,
      category: payload.category,
      description: payload.description,
      salary: Number(payload.budget.min || 0),
      type: payload.workType,
      skillsRequired: payload.skillsRequired,
      experienceLevel: payload.experienceLevel,
      minExperience: payload.minExperience,
      location: 'New opening',
      createdAt: new Date().toISOString(),
      applicantsCount: 0,
      openRoles: 1,
      source: 'mock'
    };
  }

  private prependLocalJob(job: EmployerJob): void {
    this.jobsSubject.next([job, ...this.jobsSubject.value.filter(item => item.id !== job.id)]);
  }

  private mapApiJobResponse(response: any, fallback: EmployerJob): EmployerJob {
    const job = response?.job || response?.data?.job || response?.data || response;

    return {
      ...fallback,
      id: job?._id || job?.id || fallback.id,
      title: job?.title || fallback.title,
      category: job?.category || fallback.category,
      description: job?.description || fallback.description,
      type: job?.workType || job?.type || fallback.type,
      skillsRequired: job?.skillsRequired || fallback.skillsRequired,
      experienceLevel: job?.experienceLevel || fallback.experienceLevel,
      minExperience: job?.minExperience || fallback.minExperience,
      salary: Number(job?.budget?.min || job?.salary || fallback.salary),
      createdAt: job?.createdAt || fallback.createdAt,
      source: 'api'
    };
  }
}
