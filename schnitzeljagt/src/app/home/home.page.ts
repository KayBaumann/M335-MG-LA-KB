import { Component, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Geolocation } from '@capacitor/geolocation';
import { Camera } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

import { GameSessionService } from '../session/game-session.service';

type Step = 'name' | 'permissions';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule, FormsModule],
})
export class HomePage {
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    private router: Router,
    private session: GameSessionService,
  ) { }

  step: Step = 'name';
  name = '';

  cameraPermission = false;
  locationPermission = false;

  requestingCamera = false;
  requestingLocation = false;

  get canStart() {
    return !!this.name.trim() && this.cameraPermission && this.locationPermission;
  }

  async goToPermissions() {
    if (!this.name.trim()) return;
    this.step = 'permissions';
    await this.refreshPermissions();
  }

  backToName() {
    this.step = 'name';
  }

  async refreshPermissions() {
    const [geo, cam] = await Promise.all([
      Geolocation.checkPermissions(),
      Camera.checkPermissions(),
    ]);

    this.zone.run(() => {
      this.locationPermission = geo.location === 'granted';
      this.cameraPermission = cam.camera === 'granted';
      this.cdr.detectChanges();
    });
  }

  async requestLocationPermission() {
    if (this.locationPermission || this.requestingLocation) return;

    this.requestingLocation = true;
    try {
      await Geolocation.requestPermissions();
      // kurzer Tick, damit OS den Status sicher persistiert
      await new Promise(r => setTimeout(r, 100));
      await this.refreshPermissions();
    } finally {
      this.zone.run(() => {
        this.requestingLocation = false;
        this.cdr.detectChanges();
      });
    }
  }

  async requestCameraPermission() {
    if (this.cameraPermission || this.requestingCamera) return;

    this.requestingCamera = true;
    try {
      const platform = Capacitor.getPlatform();

      if (platform === 'web') {
        // Web: Permission wird erst durch echten Kamera Zugriff ausgelöst
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(t => t.stop());
      } else {
        // Native: normaler Capacitor Weg
        await Camera.requestPermissions();
      }

      await new Promise(r => setTimeout(r, 100));
      await this.refreshPermissions();
    } catch {
      // bleibt rot wenn user denied
      await this.refreshPermissions();
    } finally {
      this.zone.run(() => {
        this.requestingCamera = false;
        this.cdr.detectChanges();
      });
    }
  }

  startGame() {
    if (!this.canStart) return;

    this.session.startNewSession(this.name);
    this.router.navigate(['/tasks'], { replaceUrl: true });
  }

  viewHistory() { console.log('View History clicked'); }
}
