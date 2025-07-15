import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare const google: any;

@Component({
  selector: 'app-immobilien',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './immobilien.html',
})
export class Immobilien implements OnInit, AfterViewInit {
  immobilien = { description: '', address: '' };
  immobilienListe: any[] = [];
  isEdit = false;
  editId: string | null = null;

    ngOnInit() {
    this.loadImmobilien(); // <-- HIER laden!
  }

  ngAfterViewInit() {
    this.initAutocomplete();
  }

  // Immer mit ID arbeiten – auch für "alte" Immobilien nachladen!
  loadImmobilien() {
    const gespeicherteDaten = localStorage.getItem('immobilien');
    let list = gespeicherteDaten ? JSON.parse(gespeicherteDaten) : [];
    // Nachträglich allen Objekten ohne id eine ID geben
    let changed = false;
    list = list.map((item: any) => {
      if (!item.id) {
        item.id = crypto.randomUUID();
        changed = true;
      }
      return item;
    });
    if (changed) {
      localStorage.setItem('immobilien', JSON.stringify(list));
    }
    this.immobilienListe = list;
  }

  addOrUpdateImmobilie(form: any) {
    if (!this.immobilien.description.trim() || !this.immobilien.address.trim()) return;

    if (this.isEdit && this.editId) {
      // Nur ein einziges Objekt mit passender ID ersetzen!
      const idx = this.immobilienListe.findIndex(immo => immo.id === this.editId);
      if (idx !== -1) {
        this.immobilienListe[idx] = { ...this.immobilien, id: this.editId };
      }
      this.isEdit = false;
      this.editId = null;
    } else {
      // Immer mit id speichern!
      const newImmo = { ...this.immobilien, id: crypto.randomUUID() };
      this.immobilienListe.push(newImmo);
    }

    localStorage.setItem('immobilien', JSON.stringify(this.immobilienListe));
    this.immobilien = { description: '', address: '' };
    if (form) form.resetForm();
    setTimeout(() => this.initAutocomplete(), 50);
  }

  editImmobilie(immo: any) {
    this.isEdit = true;
    this.editId = immo.id;
    this.immobilien = { description: immo.description, address: immo.address };
    setTimeout(() => this.initAutocomplete(), 50);
  }

  cancelEdit(form?: any) {
    this.isEdit = false;
    this.editId = null;
    this.immobilien = { description: '', address: '' };
    if (form) form.resetForm();
    setTimeout(() => this.initAutocomplete(), 50);
  }

  deleteImmobilie(item: any) {
    this.immobilienListe = this.immobilienListe.filter(i => i.id !== item.id);
    localStorage.setItem('immobilien', JSON.stringify(this.immobilienListe));
    if (this.editId === item.id) this.cancelEdit();
  }

  // Adress-Autofill für Google Places
  private initAutocomplete() {
    const input = document.getElementById('autocomplete') as HTMLInputElement;
    if (input && google?.maps?.places) {
      if ((input as any)._autocompleteListener) {
        google.maps.event.clearInstanceListeners(input);
      }
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        this.immobilien.address = place.formatted_address || '';
      });
      (input as any)._autocompleteListener = true;
    }
  }
}
