import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { ToastOutletComponent } from '../../shared/components/toast-outlet/toast-outlet.component';

interface MenuItem {
  label: string;
  icon: string;
  link: string;
  exact?: boolean;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastOutletComponent],
  templateUrl: './layout-component.html',
  styleUrls: ['./layout-component.css']
})
export class LayoutComponent {
  isSidebarCollapsed = false;
  menuOpen = false;
  private readonly candidateMenuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'fas fa-home', link: '/dashboard', exact: true },
    { label: 'Job Matches', icon: 'fas fa-briefcase', link: '/jobs' },
    { label: 'My Applications', icon: 'fas fa-file-alt', link: '/applications' },
    { label: 'Profile', icon: 'fas fa-user', link: '/profile' },
    { label: 'Settings', icon: 'fas fa-cog', link: '/settings' }
  ];
  private readonly employerMenuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'fas fa-home', link: '/employer/dashboard', exact: true },
    { label: 'Jobs', icon: 'fas fa-briefcase', link: '/employer/jobs' },
    { label: 'Applicants', icon: 'fas fa-users', link: '/employer/jobs/job-001/applicants' }
  ];

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  get currentRole(): string {
    return this.auth.getUserFromToken()?.role || localStorage.getItem('role') || 'candidate';
  }

  get userName(): string {
    const user = this.auth.getUserFromToken();
    if (!user) return this.currentRole === 'employer' ? 'Employer' : 'Candidate';

    return (
      user?.firstName ||
      user?.fullName ||
      user?.username ||
      user?.email?.split('@')[0] ||
      (this.currentRole === 'employer' ? 'Employer' : 'Candidate')
    );
  }

  get userEmail(): string {
    return this.auth.getUserFromToken()?.email || '';
  }

  get menuItems(): MenuItem[] {
    return this.currentRole === 'employer'
      ? this.employerMenuItems
      : this.candidateMenuItems;
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  get pageTitle(): string {
    const url = this.router.url;

    if (url.includes('/employer/jobs/') && url.includes('/applicants')) return 'Applicants';
    if (url.includes('/employer/jobs')) return 'Jobs';
    if (url.includes('/employer/dashboard')) return 'Employer Dashboard';
    if (url.includes('/jobs')) return 'Job Matches';
    if (url.includes('/applications')) return 'My Applications';
    if (url.includes('/profile')) return 'Profile';
    if (url.includes('/settings')) return 'Settings';
    return 'Dashboard';
  }

  logout(): void {
    this.auth.logout();
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
