import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  isExpanded = signal(true);
  selected = signal(0);

  navItems = [
    { label: 'Immobilien', icon: '🏠', route: '/immobilien' },
    { label: 'Kontakte', icon: '📇', route: '/kontakte' },
    { label: 'Beziehungen', icon: '🤝', route: '/beziehungen' }
  ];

  // Router Injection (für Standalone-Component)
  private router = inject(Router);

  toggleSidebar() {
    this.isExpanded.update((val: boolean) => !val);
  }

  select(index: number) {
    this.selected.set(index);
  }

    // Diese Methode einfach für Logout-Button aufrufen
  logout() {
    this.router.navigate(['/login']);
  }

}
