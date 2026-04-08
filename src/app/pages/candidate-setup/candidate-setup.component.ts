import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-candidate-setup',
  imports: [CommonModule, FormsModule],
  templateUrl: './candidate-setup.component.html',
  styleUrl: './candidate-setup.component.css'
})
export class CandidateSetupComponent {

  loading = false;
  success = false;
  submitted = false;
  errorMessage = '';

  // 🔥 skills system
  skills: string[] = [];
  skillInput = '';

  candidate = {
    specialization: '',
    experienceLevel: '',
    expectedSalary: '',
    workType: '',
    status: '',
    cvUrl: ''
  };

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  isEmpty(value: any) {
    return !value || value.toString().trim() === '';
  }

  // 🔥 ADD SKILL
  addSkill(event: any) {
  event.preventDefault();

  const value = this.skillInput.trim();

  if (value && !this.skills.includes(value)) {
    this.skills.push(value);
  }

  this.skillInput = '';
}

  // 🔥 REMOVE SKILL
  removeSkill(index: number) {
    this.skills.splice(index, 1);
  }

  submit() {
    this.submitted = true;
    this.errorMessage = '';

    if (
      this.isEmpty(this.candidate.specialization) ||
      this.isEmpty(this.candidate.experienceLevel) ||
      this.isEmpty(this.candidate.expectedSalary) ||
      this.isEmpty(this.candidate.workType) ||
      this.isEmpty(this.candidate.cvUrl) ||
      this.skills.length === 0 ||
      this.isEmpty(this.candidate.status)
    ) {
      this.errorMessage = 'Please fill all fields ❌';
      return;
    }

    this.loading = true;

    const payload = {
      candidateProfile: {
        specialization: this.candidate.specialization,
        experienceLevel: this.candidate.experienceLevel,
        expectedSalary: Number(this.candidate.expectedSalary),
        workType: this.candidate.workType,
        cvUrl: this.candidate.cvUrl,
        skills: this.skills,
        status: this.candidate.status
      }
    };

    console.log('FINAL PAYLOAD 👉', payload);

    this.auth.updateCandidateProfile(payload).subscribe({

      next: () => {
        this.loading = false;
        this.success = true;

        // 🔥 أهم سطر (حل المشكلة)
        setTimeout(() => {
          this.router.navigate(['/dashboard'], { replaceUrl: true });
        }, 1000);
      },

      error: (err: any) => {
        this.loading = false;

        this.errorMessage =
          err?.error?.message || 'Something went wrong ❌';
      }
    });
  }
}