import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileForm: any;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.profileForm = this.fb.group({
      specialization: [''],
      experienceLevel: [''],
      expectedSalary: [''],
      workType: ['']
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  // 🔥 GET PROFILE
  loadProfile() {
    this.auth.getCandidateProfile().subscribe({
      next: (res: any) => {

        console.log('PROFILE 👉', res);

        const profile = res?.user?.candidateProfile;

        if (!profile) return;

        this.profileForm.patchValue({
          specialization: profile.specialization,
          experienceLevel: profile.experienceLevel,
          expectedSalary: profile.expectedSalary,
          workType: profile.workType
        });
      },
      error: (err) => {
        console.error('ERROR ❌', err);
      }
    });
  }

  // 🔥 UPDATE PROFILE (FIXED)
  submit() {

    const form = this.profileForm.value;

    const body = {
      candidateProfile: {
        specialization: form.specialization,
        experienceLevel: form.experienceLevel,
        expectedSalary: +form.expectedSalary,
        workType: form.workType,
        cvUrl: "cv-link",       // ثابت مؤقت
        skills: ["angular"]     // ثابت مؤقت
      }
    };

    this.auth.updateCandidateProfile(body).subscribe({
      next: () => {
        alert('Updated Successfully 🔥');

        // 🔥 أهم خطوة
        this.loadProfile();
      },
      error: (err) => {
        console.error('UPDATE ERROR ❌', err);
      }
    });
  }
}