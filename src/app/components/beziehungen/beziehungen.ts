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

  // Für Bearbeiten-Modus
  isEdit = false;
  editId: string | null = null;

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    this.immobilienListe = JSON.parse(localStorage.getItem('immobilien') || '[]');
    this.kontaktListe    = JSON.parse(localStorage.getItem('kontakte')   || '[]');
    this.beziehungenListe = JSON.parse(localStorage.getItem('beziehungen') || '[]');
  }

  addOrUpdateBeziehung(form: any): void {
    this.fehlerMeldung = '';

    if (!this.beziehung.immobilienId || !this.beziehung.kontaktId || !this.beziehung.typ || !this.beziehung.start || !this.beziehung.ende) {
      this.fehlerMeldung = 'Bitte alle Pflichtfelder ausfüllen.';
      return;
    }
    if (this.beziehung.typ === 'Dienstleister' && !this.beziehung.dienstleistungen.trim()) {
      this.fehlerMeldung = 'Bitte Dienstleistung(en) angeben.';
      return;
    }

    // Kollision prüfen: nur für Mieter, gleiche Immobilie, Zeitraum überschneidet sich
    if (this.beziehung.typ === 'Mieter') {
      const neuerStart = new Date(this.beziehung.start);
      const neuesEnde = new Date(this.beziehung.ende);

      const konflikt = this.beziehungenListe.some(b =>
        b.id !== this.editId && // Beim Bearbeiten: aktuelles ignorieren!
        b.kontaktId === this.beziehung.kontaktId &&
        b.immobilienId === this.beziehung.immobilienId &&
        b.typ === 'Mieter' &&
        (neuerStart <= new Date(b.ende)) && (neuesEnde >= new Date(b.start))
      );
      if (konflikt) {
        this.fehlerMeldung = 'Der Kontakt ist bereits Mieter dieser Immobilie im gewählten Zeitraum.';
        return;
      }
    }

    if (this.isEdit && this.editId) {
      // Überschreiben
      this.beziehungenListe = this.beziehungenListe.map(b =>
        b.id === this.editId ? { ...this.beziehung, id: this.editId } : b
      );
      this.isEdit = false;
      this.editId = null;
    } else {
      // Anlegen
      const neueBeziehung = { ...this.beziehung, id: crypto.randomUUID() };
      this.beziehungenListe.push(neueBeziehung);
    }
    localStorage.setItem('beziehungen', JSON.stringify(this.beziehungenListe));
    this.beziehung = { immobilienId: '', kontaktId: '', typ: '', start: '', ende: '', dienstleistungen: '' };
    if (form) form.resetForm();
  }

  // Für das Bearbeiten-Formular
  editBeziehung(b: any) {
    this.isEdit = true;
    this.editId = b.id;
    this.beziehung = {
      immobilienId: b.immobilienId,
      kontaktId: b.kontaktId,
      typ: b.typ,
      start: b.start,
      ende: b.ende,
      dienstleistungen: b.dienstleistungen || ''
    };
  }

  cancelEdit(form?: any) {
    this.isEdit = false;
    this.editId = null;
    this.beziehung = { immobilienId: '', kontaktId: '', typ: '', start: '', ende: '', dienstleistungen: '' };
    if (form) form.resetForm();
  }

  deleteBeziehung(b: any): void {
    this.beziehungenListe = this.beziehungenListe.filter(x => x.id !== b.id);
    localStorage.setItem('beziehungen', JSON.stringify(this.beziehungenListe));
    // Falls gerade bearbeitet wird und der Datensatz wird gelöscht → Edit abbrechen!
    if (this.editId === b.id) {
      this.cancelEdit();
    }
  }

  getImmobilie(id: string): any {
    return this.immobilienListe.find(i => i.id === id);
  }
  getKontakt(id: string): any {
    return this.kontaktListe.find(k => k.id === id);
  }
}
