import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, timeout } from 'rxjs/operators';

import { AuthService } from '../../../core/services/auth.service';
import { EmployerApplicationsService } from '../../../core/services/employer-applications.service';
import { EmployerJobsService } from '../../../core/services/employer-jobs.service';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class EmployerDashboardComponent implements OnInit {
  loading = false;
  error = '';
  userName = 'Employer';
  stats = {
    jobs: 0,
    applicants: 0,
    pending: 0,
    accepted: 0
  };
  featuredJobs: Array<{ id: string; title: string; applicantsCount: number; type: string; createdAt: string }> = [];

  constructor(
    private jobsService: EmployerJobsService,
    private applicationsService: EmployerApplicationsService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.auth.getUserFromToken();
    this.userName = user?.firstName || user?.fullName || user?.email?.split('@')[0] || 'Employer';
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      jobs: this.jobsService.getJobs().pipe(
        timeout(4000),
        catchError(() => of([]))
      ),
      applicants: this.applicationsService.getAllApplicants().pipe(
        timeout(4000),
        catchError(() => of([]))
      )
    }).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: ({ jobs, applicants }) => {
        this.stats.jobs = jobs.length;
        this.stats.applicants = applicants.length;
        this.stats.pending = applicants.filter(applicant => applicant.status === 'pending').length;
        this.stats.accepted = applicants.filter(applicant => applicant.status === 'accepted').length;
        this.featuredJobs = jobs.slice(0, 4);
      },
      error: () => {
        this.error = 'Unable to load employer dashboard.';
      }
    });
  }
}
