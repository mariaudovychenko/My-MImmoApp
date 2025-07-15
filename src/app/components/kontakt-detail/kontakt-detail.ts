import { Component, inject } from '@angular/core';
import {  CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-kontakt-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './kontakt-detail.html',
})
export class KontaktDetail {
  kontaktId = inject(ActivatedRoute).snapshot.paramMap.get('id');
  kontakt: any = null;
  beziehungen: any[] = [];

  ngOnInit() {
    const kontakte = JSON.parse(localStorage.getItem('kontakte') || '[]');
    this.kontakt = kontakte.find((k: any) => k.id === this.kontaktId);

    const alleBeziehungen = JSON.parse(localStorage.getItem('beziehungen') || '[]');
    this.beziehungen = alleBeziehungen.filter((b: any) => b.kontaktId === this.kontaktId);
  }

   goBack() {
    history.back();
  }
}
