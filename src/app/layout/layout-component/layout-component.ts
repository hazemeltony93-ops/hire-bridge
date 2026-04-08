import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout-component.html',
  styleUrls: ['./layout-component.css']
})
export class LayoutComponent {

  isSidebarCollapsed = false;
  menuOpen = false;

  user = {
    name: 'Ahmed',
    image: 'https://i.pravatar.cc/40'
  };

  constructor(private router: Router) {}

  // 🔥 Toggle Sidebar
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // 🔥 Toggle Dropdown
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // 🔥 Dynamic Page Title (احترافي)
  get pageTitle(): string {
    const url = this.router.url;

    if (url.includes('jobs')) return 'Jobs';
    if (url.includes('profile')) return 'Profile';
    if (url.includes('candidates')) return 'Candidates';
    if (url.includes('interviews')) return 'Interviews';
    if (url.includes('settings')) return 'Settings';

    return 'Dashboard';
  }

  // 🔥 Logout (هنربطه بعدين بالـ API)
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}