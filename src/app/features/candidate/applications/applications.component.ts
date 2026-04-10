import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationsService } from '../../../core/services/applications.service';

@Component({
  standalone: true,
  selector: 'app-candidate-applications',
  imports: [CommonModule, FormsModule],
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {
  loading = false;
  error = '';
  applications: any[] = [];
  statusFilter = 'all';
  searchTerm = '';

  constructor(private applicationsService: ApplicationsService) {}

  ngOnInit() {
    this.loadApplications();
  }

  get filteredApplications() {
    const filter = this.statusFilter.toLowerCase();
    const search = this.searchTerm.toLowerCase();

    return this.applications.filter(app => {
      const matchStatus = filter === 'all' || this.normalizeStatus(app.status) === filter;
      const terms = [
        app.jobTitle,
        app.title,
        app.companyName,
        app.company,
        app.status
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matchSearch = !search || terms.includes(search);
      return matchStatus && matchSearch;
    });
  }

  private loadApplications() {
    this.loading = true;
    this.applicationsService.getApplications().subscribe({
      next: (res: any) => {
        this.loading = false;
        const user = res?.user || res;
        this.applications =
          user?.applications || user?.candidateProfile?.applications || res?.applications || [];
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err?.error?.message || 'Unable to load applications';
      }
    });
  }

  normalizeStatus(value: any): string {
    return String(value || 'pending').trim().toLowerCase();
  }

  getStatusBadgeClass(value: any): string {
    const status = this.normalizeStatus(value);
    if (status === 'accepted') return 'bg-success';
    if (status === 'rejected') return 'bg-danger';
    return 'bg-warning text-dark';
  }
}
