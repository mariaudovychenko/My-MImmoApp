import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-beziehungen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './beziehungen.html'
})
export class Beziehungen {
  beziehung = {
    immobilienId: '',
    kontaktId: '',
    typ: '',
    start: '',
    ende: '',
    dienstleistungen: ''
  };

  immobilienListe: any[] = [];
  kontaktListe: any[] = [];
  beziehungenListe: any[] = [];
  fehlerMeldung: string = '';

  constructor() {
    this.loadData();
  }

  loadData() {
    this.immobilienListe = JSON.parse(localStorage.getItem('immobilien') || '[]');
    this.kontaktListe = JSON.parse(localStorage.getItem('kontakte') || '[]');
    this.beziehungenListe = JSON.parse(localStorage.getItem('beziehungen') || '[]');
  }

  speichernBeziehung() {
    this.fehlerMeldung = '';

    // Pflichtfelder prüfen
    if (!this.beziehung.immobilienId || !this.beziehung.kontaktId || !this.beziehung.typ || !this.beziehung.start || !this.beziehung.ende) {
      this.fehlerMeldung = 'Bitte alle Pflichtfelder ausfüllen.';
      return;
    }

    // Pflichtfeld für Dienstleister
    if (this.beziehung.typ === 'Dienstleister' && !this.beziehung.dienstleistungen.trim()) {
      this.fehlerMeldung = 'Bitte Dienstleistung(en) angeben.';
      return;
    }

    // Konfliktprüfung für Mieter
    if (this.beziehung.typ === 'Mieter') {
      const konflikt = this.beziehungenListe.some(b =>
        b.kontaktId === this.beziehung.kontaktId &&
        b.typ === 'Mieter' &&
        (
          (this.beziehung.start >= b.start && this.beziehung.start <= b.ende) ||
          (this.beziehung.ende >= b.start && this.beziehung.ende <= b.ende) ||
          (b.start >= this.beziehung.start && b.start <= this.beziehung.ende)
        )
      );

      if (konflikt) {
        this.fehlerMeldung = 'Der Kontakt ist bereits Mieter im gewählten Zeitraum.';
        return;
      }
    }

    // Beziehung speichern
    const neueBeziehung = { ...this.beziehung, id: crypto.randomUUID() };
    this.beziehungenListe.push(neueBeziehung);
    localStorage.setItem('beziehungen', JSON.stringify(this.beziehungenListe));

    // Formular zurücksetzen
    this.beziehung = { immobilienId: '', kontaktId: '', typ: '', start: '', ende: '', dienstleistungen: '' };
  }

  // Alias für HTML-Template-Kompatibilität
  addBeziehung() {
    this.speichernBeziehung();
  }

  loeschenBeziehung(item: any) {
    this.beziehungenListe = this.beziehungenListe.filter(b => b !== item);
    localStorage.setItem('beziehungen', JSON.stringify(this.beziehungenListe));
  }
}
