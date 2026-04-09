import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout-component/layout-component';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 🔐 AUTH
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

  // 👤 CANDIDATE
  {
    path: 'candidate-setup',
    loadComponent: () =>
      import('./pages/candidate-setup/candidate-setup.component')
        .then(m => m.CandidateSetupComponent)
  },

  {
    path: 'profile',
    loadComponent: () =>
      import('./features/candidate/profile/profile.component')
        .then(m => m.ProfileComponent)
  },

  // 🏢 EMPLOYER
  {
    path: 'company-setup',
    loadComponent: () =>
      import('./features/employer/company-setup/company-setup.component')
        .then(m => m.CompanySetupComponent)
  },

  // 🧠 MAIN
  {
    path: 'dashboard',
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