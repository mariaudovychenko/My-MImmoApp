import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare const google: any;

@Component({
  selector: 'app-immobilien',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './immobilien.html',
})
export class Immobilien implements AfterViewInit {
  immobilien = { description: '', address: '' };
  immobilienListe: any[] = [];

  ngAfterViewInit() {
    const input = document.getElementById('autocomplete') as HTMLInputElement;
    if (input) {
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        this.immobilien.address = place.formatted_address || '';
      });
    }
    this.loadImmobilien();
  }

  loadImmobilien() {
    const gespeicherteDaten = localStorage.getItem('immobilien');
    this.immobilienListe = gespeicherteDaten ? JSON.parse(gespeicherteDaten) : [];
  }

  addImmobilien() {
    if (!this.immobilien.description.trim() || !this.immobilien.address.trim()) return;

    this.immobilienListe.push({ ...this.immobilien });
    localStorage.setItem('immobilien', JSON.stringify(this.immobilienListe));
    this.immobilien = { description: '', address: '' };
  }

  deleteImmobilie(item: any) {
    this.immobilienListe = this.immobilienListe.filter(i => i !== item);
    localStorage.setItem('immobilien', JSON.stringify(this.immobilienListe));
  }
}
