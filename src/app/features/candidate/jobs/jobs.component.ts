import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobsService } from '../../../core/services/job.service';

@Component({
  standalone: true,
  selector: 'app-candidate-jobs',
  imports: [CommonModule, FormsModule],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  loading = false;
  error = '';
  jobs: any[] = [];
  allJobs: any[] = [];
  successMessage = '';
  searchTerm = '';
  statusFilter = 'all';
  locationFilter = 'all';
  applyingJobId: string | null = null;

  constructor(private jobsService: JobsService) {}

  ngOnInit() {
    this.loadJobs();
  }

  get filteredJobs() {
    const search = this.searchTerm.toLowerCase().trim();
    const statusFilter = this.statusFilter.toLowerCase();
    const locationFilter = this.locationFilter.toLowerCase();

    return this.allJobs.filter(job => {
      const title = (job.title || job.jobTitle || '').toLowerCase();
      const company = (job.companyName || job.company || '').toLowerCase();
      const location = (job.location || job.workType || '').toLowerCase();
      const status = (job.status || 'active').toLowerCase();
      const matchesSearch = !search || title.includes(search) || company.includes(search) || location.includes(search);
      const matchesStatus = statusFilter === 'all' || status === statusFilter;
      const matchesLocation = locationFilter === 'all' || location.includes(locationFilter);
      return matchesSearch && matchesStatus && matchesLocation;
    });
  }

  get appliedCount(): number {
    return this.allJobs.filter(job => job.applied || String(job.status || '').toLowerCase() === 'applied').length;
  }

  get remoteCount(): number {
    return this.allJobs.filter(job => {
      const location = String(job.location || job.workType || '').toLowerCase();
      return location.includes('remote');
    }).length;
  }

  get activeCount(): number {
    return this.filteredJobs.filter(job => !job.applied).length;
  }

  private getJobKey(job: any) {
    return String(job.id || job.jobId || job._id || `${job.title}-${job.company}` || 'unknown');
  }

  reloadJobs() {
    this.loadJobs();
  }

  private loadJobs() {
    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.jobsService.getCandidateJobMatches().subscribe({
      next: (res: any) => {
        this.loading = false;
        const user = res?.user || res;
        const jobs = user?.jobMatches || user?.recommendedJobs || res?.jobs || [];
        this.allJobs = Array.isArray(jobs) ? jobs.map((job: any) => ({ ...job, applied: false })) : [];
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err?.error?.message || 'Unable to fetch job matches';
      }
    });
  }

  apply(job: any) {
    if (!job?.applyEndpoint) {
      this.error = 'This role cannot be applied to from the current API response.';
      return;
    }

    if (job.applied) {
      return;
    }

    this.successMessage = '';
    this.error = '';
    this.applyingJobId = this.getJobKey(job);

    this.jobsService.applyToJob(job.applyEndpoint, { jobId: job.id || job.jobId }).subscribe({
      next: () => {
        job.applied = true;
        job.status = 'Applied';
        this.successMessage = 'Application submitted successfully.';
        this.applyingJobId = null;
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Unable to submit application';
        this.applyingJobId = null;
      }
    });
  }
}
