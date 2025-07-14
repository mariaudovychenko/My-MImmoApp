// Komponente zur Verwaltung von Beziehungen zwischen 
// Immobilien, Kontakten und deren Rollen (Eigentümer, Mieter, Dienstleister).

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-beziehungen',            // Auswahl-Selektor für das Verwenden in Templates
  standalone: true,                      // Standalone-Komponente ohne Modul
  imports: [CommonModule, FormsModule],   // Eingebundene Angular-Module
  templateUrl: './beziehungen.html'       // Externes HTML-Template
})
export class Beziehungen {
  /**
   * Das Objekt für das Formular zur Anlage/Änderung einer Beziehung.
   * Felder:
   * - immobilienId: ID der ausgewählten Immobilie
   * - kontaktId: ID des ausgewählten Kontakts
   * - typ: Beziehungstyp ('Eigentümer' | 'Mieter' | 'Dienstleister')
   * - start: Startdatum der Beziehung (ISO-String 'YYYY-MM-DD')
   * - ende: Enddatum der Beziehung (ISO-String 'YYYY-MM-DD')
   * - dienstleistungen: Angebotsbeschreibung (nur Pflicht bei 'Dienstleister')
   */
  beziehung = {
    immobilienId: '',
    kontaktId: '',
    typ: '',
    start: '',
    ende: '',
    dienstleistungen: ''
  };

  /** Liste aller Immobilien aus LocalStorage */
  immobilienListe: any[] = [];
  /** Liste aller Kontakte aus LocalStorage */
  kontaktListe: any[] = [];
  /** Aktuell angelegte Beziehungen aus LocalStorage */
  beziehungenListe: any[] = [];
  /** Fehlermeldung für Validierungsfehler */
  fehlerMeldung: string = '';

  /**
   * Konstruktor: Lädt initial alle bestehenden Daten.
   */
  constructor() {
    this.loadData();
  }

  /**
   * Lädt Immobilien, Kontakte und Beziehungen aus dem LocalStorage.
   */
  private loadData(): void {
    this.immobilienListe = JSON.parse(localStorage.getItem('immobilien') || '[]');
    this.kontaktListe    = JSON.parse(localStorage.getItem('kontakte')   || '[]');
    this.beziehungenListe = JSON.parse(localStorage.getItem('beziehungen') || '[]');
  }

  /**
   * Speichert eine neue oder geänderte Beziehung.
   * Führt Validierungen durch:
   * - Alle Pflichtfelder müssen ausgefüllt sein.
   * - Bei 'Dienstleister' muss das Feld 'dienstleistungen' gefüllt sein.
   * - Bei 'Mieter' keine Terminüberschneidungen mit bestehenden Mietverhältnissen.
   */
  speichernBeziehung(): void {
    this.fehlerMeldung = '';

    // Pflichtfelder prüfen
    if (!this.beziehung.immobilienId || !this.beziehung.kontaktId || !this.beziehung.typ || !this.beziehung.start || !this.beziehung.ende) {
      this.fehlerMeldung = 'Bitte alle Pflichtfelder ausfüllen.';
      return;
    }

    // Dienstleister-Feld prüfen
    if (this.beziehung.typ === 'Dienstleister' && !this.beziehung.dienstleistungen.trim()) {
      this.fehlerMeldung = 'Bitte Dienstleistung(en) angeben.';
      return;
    }

    // Miet-Kollision prüfen
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

    // Neue Beziehung erzeugen und speichern
    const neueBeziehung = { ...this.beziehung, id: crypto.randomUUID() };
    this.beziehungenListe.push(neueBeziehung);
    localStorage.setItem('beziehungen', JSON.stringify(this.beziehungenListe));

    // Formular zurücksetzen
    this.beziehung = { immobilienId: '', kontaktId: '', typ: '', start: '', ende: '', dienstleistungen: '' };
  }

  /**
   * Alias für (ngSubmit) im HTML-Formular.
   */
  addBeziehung(): void {
    this.speichernBeziehung();
  }

  /**
   * Löscht eine vorhandene Beziehung und aktualisiert das LocalStorage.
   * @param b Die zu löschende Beziehung
   */
  deleteBeziehung(b: any): void {
    this.beziehungenListe = this.beziehungenListe.filter(x => x !== b);
    localStorage.setItem('beziehungen', JSON.stringify(this.beziehungenListe));
  }

  /**
   * Hilfsfunktion: Liefert eine Immobilie anhand ihrer ID.
   * @param id ID der Immobilie
   */
  getImmobilie(id: string): any {
    return this.immobilienListe.find(i => i.id === id);
  }

  /**
   * Hilfsfunktion: Liefert einen Kontakt anhand seiner ID.
   * @param id ID des Kontakts
   */
  getKontakt(id: string): any {
    return this.kontaktListe.find(k => k.id === id);
  }
}
