import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-kontakte',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './kontakte.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Kontakte {
  kontakt = { name: '', address: '' };
  kontaktListe: any[] = [];

  constructor() {
    this.loadKontakte();
  }

addKontakt() {
  if (!this.kontakt.name.trim() || !this.kontakt.address.trim()) return;

  const kontaktMitId = { ...this.kontakt, id: crypto.randomUUID() };
  this.kontaktListe.push(kontaktMitId);
  localStorage.setItem('kontakte', JSON.stringify(this.kontaktListe));
  this.kontakt = { name: '', address: '' };
}


  deleteKontakt(k: any) {
    this.kontaktListe = this.kontaktListe.filter(x => x !== k);
    localStorage.setItem('kontakte', JSON.stringify(this.kontaktListe));
  }

  private loadKontakte() {
    const gespeicherteDaten = localStorage.getItem('kontakte');
    this.kontaktListe = gespeicherteDaten ? JSON.parse(gespeicherteDaten) : [];
  }

  onPlaceSelect(event: any) {
    const place = event.detail;
    if (place && place.formattedAddress) {
      this.kontakt.address = place.formattedAddress;
    }
  }
}


