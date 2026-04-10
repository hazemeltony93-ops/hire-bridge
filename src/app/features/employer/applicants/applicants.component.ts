import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { ApplicationsService, ApplicationStatus } from '../../../core/services/applications.service';
import { EmployerJob, EmployerJobsService } from '../../../core/services/employer-jobs.service';

interface Applicant {
  id: string;
  jobId: string;
  name: string;
  email: string;
  status: ApplicationStatus;
}

const MOCK_APPLICANTS: Applicant[] = [
  { id: 'app-001', jobId: 'job-001', name: 'Omar Ali', email: 'omar@example.com', status: 'pending' },
  { id: 'app-002', jobId: 'job-001', name: 'Mariam Samy', email: 'mariam@example.com', status: 'pending' },
  { id: 'app-003', jobId: 'job-001', name: 'Nada Hossam', email: 'nada@example.com', status: 'pending' },
  { id: 'app-004', jobId: 'job-002', name: 'Ahmed Tarek', email: 'ahmed@example.com', status: 'pending' },
  { id: 'app-005', jobId: 'job-002', name: 'Sara Emad', email: 'sara@example.com', status: 'pending' },
  { id: 'app-006', jobId: 'job-003', name: 'Youssef Nabil', email: 'youssef@example.com', status: 'pending' }
];

@Component({
  selector: 'app-employer-applicants',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.css']
})
export class EmployerApplicantsComponent implements OnInit {
  loading = false;
  error = '';
  successMessage = '';
  job: EmployerJob | null = null;
  applicants: Applicant[] = [];
  processingApplicantIds = new Set<string>();
  currentPage = 1;
  readonly pageSize = 5;

  constructor(
    private route: ActivatedRoute,
    private jobsService: EmployerJobsService,
    private applicationsService: ApplicationsService
  ) {}

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');

    if (!jobId) {
      this.error = 'Missing job id.';
      return;
    }

    this.loadData(jobId);
  }

  get paginatedApplicants(): Applicant[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.applicants.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.applicants.length / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  acceptApplicant(id: string): void {
    this.updateStatus(id, 'accepted');
  }

  rejectApplicant(id: string): void {
    this.updateStatus(id, 'rejected');
  }

  getStatusBadgeClass(status: ApplicationStatus): string {
    const classes: Record<ApplicationStatus, string> = {
      pending: 'bg-warning text-dark',
      accepted: 'bg-success',
      rejected: 'bg-danger'
    };

    return classes[status];
  }

  isProcessing(id: string): boolean {
    return this.processingApplicantIds.has(id);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  private loadData(jobId: string): void {
    this.loading = true;
    this.error = '';

    this.jobsService.getJobById(jobId).subscribe({
      next: job => {
        this.job = job;
        this.loadApplicants(jobId);
      },
      error: () => {
        this.loading = false;
        this.error = 'Job not found.';
      }
    });
  }

  private loadApplicants(jobId: string): void {
    this.applicants = MOCK_APPLICANTS
      .filter(applicant => applicant.jobId === jobId)
      .map(applicant => ({ ...applicant }));
    this.loading = false;
  }

  private updateStatus(id: string, status: ApplicationStatus): void {
    if (this.processingApplicantIds.has(id)) {
      return;
    }

    const applicant = this.applicants.find(item => item.id === id);
    if (!applicant || applicant.status !== 'pending') {
      return;
    }

    this.error = '';
    this.successMessage = '';
    this.processingApplicantIds.add(id);

    const request$ = status === 'accepted'
      ? this.applicationsService.acceptApplication(id)
      : this.applicationsService.rejectApplication(id);

    request$
      .pipe(
        finalize(() => {
          this.processingApplicantIds.delete(id);
        })
      )
      .subscribe({
        next: response => {
          this.applicants = this.applicants.map(item =>
            item.id === response.id ? { ...item, status: response.status } : item
          );
          this.successMessage = `${applicant.name} was ${response.status}.`;
        },
        error: () => {
          this.error = 'Unable to update applicant status.';
        }
      });
  }
}
