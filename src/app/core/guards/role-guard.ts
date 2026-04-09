import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const RoleGuard: CanActivateFn = (route) => {

  const router = inject(Router);

  const role = localStorage.getItem('role');
  const expectedRole = route.data?.['role'];

  if (role === expectedRole) {
    return true;
  }

  // ❌ لو مش نفس الدور
  router.navigate(['/login'], { replaceUrl: true });
  return false;
};