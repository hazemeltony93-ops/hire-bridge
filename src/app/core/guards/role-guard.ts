import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const RoleGuard: CanActivateFn = (route) => {

  const router = inject(Router);
  const auth = inject(AuthService);

  const user = auth.getUserFromToken();
  const expectedRole = route.data?.['role'];

  // ✅ لو مفيش role مطلوب → سيبه يعدي
  if (!expectedRole) return true;

  // ❌ لو مفيش user
  if (!user) {
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }

  // 🔥 هنا التعديل المهم
  if (user.role !== expectedRole) {
    router.navigate(['/choose-role'], { replaceUrl: true }); // ✅ بدل dashboard
    return false;
  }

  return true;
};