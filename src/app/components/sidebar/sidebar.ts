import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ needed for *ngIf, *ngFor
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true, 
  imports: [CommonModule, RouterModule], // ✅ added
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  isExpanded = signal(true);
  selected = signal(0);

  navItems = [
    { label: 'Immobilien', icon: '🏠', route: '/immobilien'  },
    { label: 'Kontakte', icon: '📇', route: '/kontakte' },
    { label: 'Beziehungen', icon: '🤝', route: '/beziehungen' }
  ];

  toggleSidebar() {
    this.isExpanded.update((val: boolean) => !val);
  }

  select(index: number) {
    this.selected.set(index);
  }
}
