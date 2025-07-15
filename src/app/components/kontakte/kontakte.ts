import { Component, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-kontakte',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './kontakte.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Kontakte implements AfterViewInit {
  kontakt = { name: '', address: '' };
  kontaktListe: any[] = [];
  isEdit = false;
  editId: string | null = null;

  constructor() {
    this.loadKontakte();
  }

  ngAfterViewInit() {
    this.initAutocomplete();
  }

  private initAutocomplete() {
    const input = document.getElementById('autocomplete-kontakt') as HTMLInputElement;
    if (input && google?.maps?.places) {
      if ((input as any)._autocompleteListener) {
        google.maps.event.clearInstanceListeners(input);
      }
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        this.kontakt.address = place.formatted_address || '';
      });
      (input as any)._autocompleteListener = true;
    }
  }

  loadKontakte() {
    const gespeicherteDaten = localStorage.getItem('kontakte');
    let list = gespeicherteDaten ? JSON.parse(gespeicherteDaten) : [];
    // Nachträglich IDs vergeben, falls nötig
    let changed = false;
    list = list.map((item: any) => {
      if (!item.id) {
        item.id = crypto.randomUUID();
        changed = true;
      }
      return item;
    });
    if (changed) {
      localStorage.setItem('kontakte', JSON.stringify(list));
    }
    this.kontaktListe = list;
  }

  addOrUpdateKontakt(form: any) {
    if (!this.kontakt.name.trim() || !this.kontakt.address.trim()) return;

    if (this.isEdit && this.editId) {
      const idx = this.kontaktListe.findIndex(k => k.id === this.editId);
      if (idx !== -1) {
        this.kontaktListe[idx] = { ...this.kontakt, id: this.editId };
      }
      this.isEdit = false;
      this.editId = null;
    } else {
      const newKontakt = { ...this.kontakt, id: crypto.randomUUID() };
      this.kontaktListe.push(newKontakt);
    }

    localStorage.setItem('kontakte', JSON.stringify(this.kontaktListe));
    this.kontakt = { name: '', address: '' };
    if (form) form.resetForm();
    setTimeout(() => this.initAutocomplete(), 50);
  }

  editKontakt(k: any) {
    this.isEdit = true;
    this.editId = k.id;
    this.kontakt = { name: k.name, address: k.address };
    setTimeout(() => this.initAutocomplete(), 50);
  }

  cancelEdit(form?: any) {
    this.isEdit = false;
    this.editId = null;
    this.kontakt = { name: '', address: '' };
    if (form) form.resetForm();
    setTimeout(() => this.initAutocomplete(), 50);
  }

  deleteKontakt(k: any) {
    this.kontaktListe = this.kontaktListe.filter(x => x.id !== k.id);
    localStorage.setItem('kontakte', JSON.stringify(this.kontaktListe));
    if (this.editId === k.id) {
      this.cancelEdit();
    }
  }
}
