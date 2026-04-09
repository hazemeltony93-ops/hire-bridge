import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout-component/layout-component';
import { AuthGuard } from './core/guards/auth-guard';
import { RoleGuard } from './core/guards/role-guard';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 🔐 AUTH
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component')
        .then(m => m.LoginComponent)
  },

  {
    path: 'signup',
    loadComponent: () =>
      import('./components/sign-up/sign-up.component')
        .then(m => m.SignupComponent)
  },

  {
    path: 'verify-email',
    loadComponent: () =>
      import('./pages/verify-email/verify-email.component')
        .then(m => m.VerifyEmailComponent)
  },

  // 🏢 COMPANY VERIFY
  {
    path: 'company-verify-email',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'employer' },
    loadComponent: () =>
      import('./pages/company-verify-email/company-verify-email')
        .then(m => m.CompanyVerifyEmailComponent)
  },

  // 👤 AFTER LOGIN
  {
    path: 'choose-role',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/choose-role/choose-role.component')
        .then(m => m.ChooseRoleComponent)
  },

  // 👤 CANDIDATE
  {
    path: 'candidate-setup',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'candidate' },
    loadComponent: () =>
      import('./pages/candidate-setup/candidate-setup.component')
        .then(m => m.CandidateSetupComponent)
  },

  {
    path: 'profile',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'candidate' },
    loadComponent: () =>
      import('./components/candidate/profile/profile.component')
        .then(m => m.ProfileComponent)
  },

  // 🏢 EMPLOYER
  {
    path: 'company-setup',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'employer' },
    loadComponent: () =>
      import('./features/employer/company-setup/company-setup.component')
        .then(m => m.CompanySetupComponent)
  },

  // 🧠 MAIN
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },

  // 🎨 LAYOUT
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // ❌ NOT FOUND
  { path: '**', redirectTo: 'login' }

];