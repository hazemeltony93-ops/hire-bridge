import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout-component/layout-component';
import { authGuard } from './core/guards/auth-guard';
import { RoleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/sign-up/sign-up.component')
        .then(m => m.SignupComponent)
  },
  {
    path: 'verify-email',
    loadComponent: () =>
      import('./pages/verify-email/verify-email.component')
        .then(m => m.VerifyEmailComponent)
  },
  {
    path: 'company-verify-email',
    loadComponent: () =>
      import('./pages/company-verify-email/company-verify-email')
        .then(m => m.CompanyVerifyEmailComponent)
  },
  {
    path: 'choose-role',
    loadComponent: () =>
      import('./pages/choose-role/choose-role.component')
        .then(m => m.ChooseRoleComponent)
  },
  {
    path: 'candidate-setup',
    loadComponent: () =>
      import('./pages/candidate-setup/candidate-setup.component')
        .then(m => m.CandidateSetupComponent)
  },
  {
    path: 'company-setup',
    loadComponent: () =>
      import('./features/employer/company-setup/company-setup.component')
        .then(m => m.CompanySetupComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard, RoleGuard],
    data: { role: 'candidate' },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/candidate/dashboard/dashboard.component')
            .then(m => m.CandidateDashboardComponent)
      },
      {
        path: 'jobs',
        loadComponent: () =>
          import('./features/candidate/jobs/jobs.component')
            .then(m => m.JobsComponent)
      },
      {
        path: 'applications',
        loadComponent: () =>
          import('./features/candidate/applications/applications.component')
            .then(m => m.ApplicationsComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/candidate/profile/profile.component')
            .then(m => m.ProfileComponent)
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/candidate/settings/settings.component')
            .then(m => m.SettingsComponent)
      }
    ]
  },
  {
    path: 'employer',
    component: LayoutComponent,
    canActivate: [authGuard, RoleGuard],
    data: { role: 'employer' },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/employer/dashboard/dashboard.component')
            .then(m => m.EmployerDashboardComponent)
      },
      {
        path: 'jobs',
        loadComponent: () =>
          import('./features/employer/jobs/jobs.component')
            .then(m => m.EmployerJobsComponent)
      },
      {
        path: 'jobs/:id/applicants',
        loadComponent: () =>
          import('./features/employer/applicants/applicants.component')
            .then(m => m.EmployerApplicantsComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
