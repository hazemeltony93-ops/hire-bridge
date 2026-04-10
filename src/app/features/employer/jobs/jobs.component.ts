import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { EmployerJob, EmployerJobsService } from '../../../core/services/employer-jobs.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-employer-jobs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class EmployerJobsComponent implements OnInit {
  loading = false;
  saving = false;
  error = '';
  jobs: EmployerJob[] = [];
  currentPage = 1;
  readonly pageSize = 4;
  editingJobId: string | null = null;
  readonly jobForm;

  constructor(
    private fb: FormBuilder,
    private jobsService: EmployerJobsService,
    private toastService: ToastService
  ) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      skillsRequired: ['', Validators.required],
      experienceLevel: ['', Validators.required],
      minExperience: ['', Validators.required],
      budgetMin: [null as number | null, [Validators.required, Validators.min(1)]],
      budgetMax: [null as number | null, [Validators.required, Validators.min(1)]],
      workType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadJobs();
  }

  get paginatedJobs(): EmployerJob[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.jobs.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.jobs.length / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  hasError(controlName: string, errorName?: string): boolean {
    const control = this.jobForm.get(controlName);

    if (!control || !(control.touched || control.dirty)) {
      return false;
    }

    return errorName ? !!control.hasError(errorName) : control.invalid;
  }

  loadJobs(): void {
    this.loading = true;
    this.error = '';

    this.jobsService.getJobs().subscribe({
      next: jobs => {
        this.loading = false;
        this.jobs = jobs;
        this.currentPage = Math.min(this.currentPage, this.totalPages);
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load jobs.';
      }
    });
  }

  submit(): void {
    if (this.jobForm.invalid || this.saving) {
      const invalidFields = Object.entries(this.jobForm.controls)
        .filter(([, control]) => control.invalid)
        .map(([name, control]) => ({ name, errors: control.errors }));

      console.warn('Employer job form invalid or already saving', {
        invalid: this.jobForm.invalid,
        saving: this.saving,
        formValue: this.jobForm.getRawValue(),
        invalidFields
      });
      this.jobForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const form = this.jobForm.getRawValue();
    const payload = {
      title: form.title || '',
      category: form.category || '',
      description: form.description || '',
      skillsRequired: String(form.skillsRequired || '')
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean),
      experienceLevel: form.experienceLevel || '',
      minExperience: String(form.minExperience || ''),
      budget: {
        min: String(form.budgetMin || 0),
        max: String(form.budgetMax || 0)
      },
      workType: form.workType || ''
    };

    console.log('Employer job submit clicked');
    console.log('Employer job form payload:', payload);

    const request$ = this.editingJobId
      ? this.jobsService.updateJob(this.editingJobId, payload)
      : this.jobsService.createJob(payload);

    request$.subscribe({
      next: (response: any) => {
        this.saving = false;
        console.log('Employer job submit success:', response);
        this.toastService.success(this.editingJobId ? 'Job updated successfully.' : 'Job created successfully.');
        this.resetForm();
        this.loadJobs();
      },
      error: (err: any) => {
        this.saving = false;
        console.error('Employer job submit failed:', err);
        this.toastService.error(err.message || 'Unable to save job.');
      }
    });
  }

  editJob(job: EmployerJob): void {
    this.editingJobId = job.id;
    this.jobForm.patchValue({
      title: job.title,
      category: job.category || '',
      description: job.description,
      skillsRequired: (job.skillsRequired || []).join(', '),
      experienceLevel: job.experienceLevel || '',
      minExperience: job.minExperience || '',
      budgetMin: job.salary,
      budgetMax: job.salary,
      workType: job.type || ''
    });
  }

  deleteJob(job: EmployerJob): void {
    this.jobsService.deleteJob(job.id).subscribe({
      next: () => {
        this.toastService.info(`Deleted "${job.title}".`);
        this.loadJobs();
      },
      error: () => {
        this.toastService.error('Unable to delete job.');
      }
    });
  }

  resetForm(): void {
    this.editingJobId = null;
    this.jobForm.reset({
      title: '',
      category: '',
      description: '',
      skillsRequired: '',
      experienceLevel: '',
      minExperience: '',
      budgetMin: null,
      budgetMax: null,
      workType: ''
    });
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }
}
