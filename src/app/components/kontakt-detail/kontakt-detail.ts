import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    // Kontakte laden
    const kontakte = JSON.parse(localStorage.getItem('kontakte') || '[]');
    this.kontakt = kontakte.find((k: any) => k.id === this.kontaktId);

    // Beziehungen und Immobilien laden
    const alleBeziehungen = JSON.parse(localStorage.getItem('beziehungen') || '[]');
    const immobilienListe = JSON.parse(localStorage.getItem('immobilien') || '[]');

    // Zu jeder Beziehung passende Immobilie mappen
    this.beziehungen = alleBeziehungen
      .filter((b: any) => b.kontaktId === this.kontaktId)
      .map((b: any) => {
        const immo = immobilienListe.find((i: any) => i.id === b.immobilienId);
        return {
          ...b,
          bezug: immo ? `${immo.description} – ${immo.address}` : '(unbekannte Immobilie)'
        };
      });
  }

  goBack() {
    history.back();
  }
}
