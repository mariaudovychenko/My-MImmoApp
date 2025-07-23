import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit {
  protected readonly title = signal('angular_testaufgabe');

  ngOnInit() {
    this.loadGoogleMapsScript();
  }

  private loadGoogleMapsScript() {
    const scriptId = 'google-maps-script';
    if (document.getElementById(scriptId)) {
      return; // Script wurde schon geladen
    }
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
}