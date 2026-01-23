import { Component, OnDestroy, OnInit, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { Geolocation, Position } from '@capacitor/geolocation';
import { BaseTask } from '../base-task/base-task';

@Component({
  selector: 'app-geolocation-task',
  templateUrl: './geolocation-task.component.html',
  styleUrls: ['./geolocation-task.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon],
})
export class GeolocationTaskComponent extends BaseTask implements OnInit, OnDestroy {
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  readonly TARGET_LATITUDE = 47.027455400650055;
  readonly TARGET_LONGITUDE = 8.301320050820248;
  readonly TARGET_DISTANCE_THRESHOLD = 20; // Meter

  userLatitude: number | null = null;
  userLongitude: number | null = null;

  distanceToTarget: number | null = null;
  isWithinTargetDistance = false;

  isTrackingLocation = false;
  locationError: string | null = null;
  permissionStatus: 'checking' | 'granted' | 'denied' = 'checking';

  private geolocationWatchId: string | null = null;

  ngOnInit() {
    this.initializeLocationTracking();
  }

  ngOnDestroy() {
    this.stopLocationTracking();
  }

  async initializeLocationTracking() {
    this.locationError = null;
    this.permissionStatus = 'checking';

    try {
      const p = await Geolocation.checkPermissions();

      const granted =
        p.location === 'granted' ||
        (p as any).coarseLocation === 'granted';

      if (granted) {
        this.permissionStatus = 'granted';
        await this.startLocationTracking();
        return;
      }

      const req = await Geolocation.requestPermissions();

      const reqGranted =
        req.location === 'granted' ||
        (req as any).coarseLocation === 'granted';

      if (reqGranted) {
        this.permissionStatus = 'granted';
        await this.startLocationTracking();
        return;
      }

      this.permissionStatus = 'denied';
      this.locationError = 'Standortzugriff verweigert. Bitte aktiviere Standort in den Einstellungen.';
      this.cdr.detectChanges();
    } catch (e: any) {
      this.permissionStatus = 'denied';
      this.locationError = `Fehler beim Initialisieren der Standortverfolgung: ${e?.message ?? e}`;
      this.cdr.detectChanges();
    }
  }

  async startLocationTracking() {
    if (this.geolocationWatchId) return;

    this.isTrackingLocation = true;
    this.locationError = null;

    try {
      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      };

      this.geolocationWatchId = await Geolocation.watchPosition(options, (position, error) => {
        if (error) {
          this.handleLocationError(error);
          return;
        }
        this.handleLocationUpdate(position);
      });
    } catch (e: any) {
      this.isTrackingLocation = false;
      this.locationError = `Fehler beim Starten des Trackings: ${e?.message ?? e}`;
      this.cdr.detectChanges();
    }
  }

  stopLocationTracking() {
    const id = this.geolocationWatchId;
    this.geolocationWatchId = null;
    this.isTrackingLocation = false;

    if (!id) return;

    Geolocation.clearWatch({ id }).catch(() => { });
  }

  private handleLocationUpdate(position: Position | null) {
    if (!position?.coords) return;

    this.ngZone.run(() => {
      this.userLatitude = position.coords.latitude;
      this.userLongitude = position.coords.longitude;
      this.locationError = null;

      const accuracy = position.coords.accuracy ?? 999;

      this.calculateDistanceToTarget();

      if (this.isWithinTargetDistance) {
        this.stopLocationTracking();
        this.finish();
      }

      this.cdr.detectChanges();
    });
  }

  private handleLocationError(error: any) {
    this.ngZone.run(() => {
      this.isTrackingLocation = false;
      this.locationError = error?.message
        ? `Standortfehler: ${error.message}`
        : 'Fehler beim Abrufen des Standorts.';
      this.cdr.detectChanges();
    });
  }

  calculateDistanceToTarget() {
    if (this.userLatitude === null || this.userLongitude === null) {
      this.distanceToTarget = null;
      this.isWithinTargetDistance = false;
      return;
    }

    const R = 6371e3;

    const lat1 = this.degreesToRadians(this.userLatitude);
    const lat2 = this.degreesToRadians(this.TARGET_LATITUDE);
    const dLat = this.degreesToRadians(this.TARGET_LATITUDE - this.userLatitude);
    const dLon = this.degreesToRadians(this.TARGET_LONGITUDE - this.userLongitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    this.distanceToTarget = Math.round(R * c);
    this.isWithinTargetDistance = this.distanceToTarget <= this.TARGET_DISTANCE_THRESHOLD;
  }

  private degreesToRadians(deg: number) {
    return deg * Math.PI / 180;
  }

  getFormattedDistance(): string {
    if (this.distanceToTarget === null) return 'Berechnung...';
    return `${this.distanceToTarget} m`;
  }

  getDistanceColorClass(): string {
    return this.isWithinTargetDistance ? 'greenline' : 'redline';
  }

  async retryLocationPermission() {
    await this.initializeLocationTracking();
  }
}
