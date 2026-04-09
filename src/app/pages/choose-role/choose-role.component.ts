import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-choose-role',
  imports: [CommonModule],
  templateUrl: './choose-role.component.html',
  styleUrl: './choose-role.component.css'
})
export class ChooseRoleComponent {

  selectedRole: 'candidate' | 'employer' | null = null;

  error = false;
  loading = false;

  constructor(private router: Router) {}

  selectRole(role: 'candidate' | 'employer') {
    this.selectedRole = role;
    this.error = false;
  }

  continue() {

    if (!this.selectedRole) {
      this.error = true;
      return;
    }

    this.loading = true;

    // ✅ حفظ role جوه user (اختياري)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.role = this.selectedRole;
    localStorage.setItem('user', JSON.stringify(user));

    // 🔥 المهم جدًا (عشان RoleGuard)
    localStorage.setItem('role', this.selectedRole);

    // 🚀 navigation
    setTimeout(() => {
      if (this.selectedRole === 'candidate') {
        this.router.navigate(['/candidate-setup'], { replaceUrl: true });
      } else {
        this.router.navigate(['/company-setup'], { replaceUrl: true });
      }
    }, 300);
  }
}