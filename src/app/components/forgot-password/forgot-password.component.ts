import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
email = '';
  messageSent = false;
  loading = false;

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.loading = true;

    // simulate API request
    setTimeout(() => {
      this.loading = false;
      this.messageSent = true;
      form.reset();
    }, 1500);
  }
}
