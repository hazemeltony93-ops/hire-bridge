import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// 🔥 بدل AuthService
import { CandidateService } from '../../../core/services/candidate.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileForm: any;

  constructor(
    private fb: FormBuilder,
    private candidate: CandidateService // ✅ هنا التعديل
  ) {
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
    this.candidate.getCandidateProfile().subscribe({
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
      error: (err: any) => { // ✅ fix TS error
        console.error('ERROR ❌', err);
      }
    });
  }

  // 🔥 UPDATE PROFILE
  submit() {

    const form = this.profileForm.value;

    const body = {
      candidateProfile: {
        specialization: form.specialization,
        experienceLevel: form.experienceLevel,
        expectedSalary: +form.expectedSalary,
        workType: form.workType,
        cvUrl: "cv-link",       // مؤقت
        skills: ["angular"]     // مؤقت
      }
    };

    this.candidate.updateCandidateProfile(body).subscribe({
      next: () => {
        alert('Updated Successfully 🔥');

        this.loadProfile(); // 🔥 reload
      },
      error: (err: any) => { // ✅ fix TS error
        console.error('UPDATE ERROR ❌', err);
      }
    });
  }
}