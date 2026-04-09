import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit, OnDestroy {

  user = {
    name: 'Ahmed',
    image: 'https://i.pravatar.cc/100'
  };

  menuOpen = false;
  isSidebarCollapsed = false;

  barChart: any;
  pieChart: any;

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  ngAfterViewInit() {
    this.loadCharts();
  }

  ngOnDestroy() {
    if (this.barChart) this.barChart.destroy();
    if (this.pieChart) this.pieChart.destroy();
  }

  loadCharts() {

    // 🟦 Bar Chart
    this.barChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [{
          label: 'Hired Employees',
          data: [5, 10, 7, 12],
          backgroundColor: '#60a5fa',
          borderRadius: 10,
          barThickness: 30
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // 🔥 أهم حاجة

        plugins: {
          legend: {
            display: false
          }
        },

        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#f1f5f9'
            }
          }
        },

        animation: {
          duration: 1200,
          easing: 'easeOutQuart'
        }
      }
    });


    // 🟠 Doughnut Chart
    this.pieChart = new Chart('pieChart', {
      type: 'doughnut',
      data: {
        labels: ['IT', 'HR', 'Sales'],
        datasets: [{
          data: [45, 25, 30],
          backgroundColor: [
            '#3b82f6',
            '#f43f5e',
            '#f59e0b'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // 🔥 مهم جدًا

        cutout: '70%',

        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12
            }
          }
        },

        animation: {
          animateScale: true,
          duration: 1200
        }
      }
    });
  }

  // 🔥 Navigation backup
  goToProfile() {
    this.router.navigate(['/profile']);
  }
}