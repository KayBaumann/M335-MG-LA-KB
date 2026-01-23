import { Component, OnDestroy, OnInit, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { DecimalPipe } from '@angular/common';
import { Geolocation, Position } from '@capacitor/geolocation';
import { BaseTask } from '../base-task/base-task';

@Component({
  selector: 'app-distance-task',
  standalone: true,
  imports: [IonButton, IonIcon, DecimalPipe],
  templateUrl: './distance-task.component.html',
  styleUrls: ['./distance-task.component.scss'],
})
export class DistanceTaskComponent extends BaseTask implements OnInit, OnDestroy {
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  readonly TARGET_DISTANCE = 10;

  tracking = false;
  distance = 0;

  locationError: string | null = null;

  private watchId: string | null = null;
  private lastPosition: Position | null = null;
  private completed = false;

  get progress(): number {
    return Math.min((this.distance / this.TARGET_DISTANCE) * 100, 100);
  }

  async ngOnInit() {
    await this.startTrackingAuto();
  }

  ngOnDestroy() {
    this.stopWatch();
  }

  async startTracking() {
    await this.startTrackingAuto();
  }

  pauseTracking() {
    this.tracking = false;
    this.stopWatch();
  }

  private async startTrackingAuto() {
    if (this.tracking || this.completed) return;

    this.tracking = true;
    this.locationError = null;

    try {
      const perm = await Geolocation.checkPermissions();
      const granted = perm.location === 'granted' || (perm as any).coarseLocation === 'granted';

      if (!granted) {
        const req = await Geolocation.requestPermissions();
        const reqGranted = req.location === 'granted' || (req as any).coarseLocation === 'granted';
        if (!reqGranted) {
          this.tracking = false;
          this.locationError = 'Standortberechtigung fehlt. Bitte in den Einstellungen aktivieren.';
          this.cdr.detectChanges();
          return;
        }
      }

      const initial = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });

      this.lastPosition = initial;

      this.watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
        (pos, err) => {
          if (err) {
            this.ngZone.run(() => {
              this.locationError = err?.message ? `Standortfehler: ${err.message}` : 'Standortfehler.';
              this.tracking = false;
              this.cdr.detectChanges();
            });
            return;
          }

          if (!pos || this.completed) return;

          this.ngZone.run(() => {
            this.locationError = null;

            if (!this.lastPosition) {
              this.lastPosition = pos;
              this.cdr.detectChanges();
              return;
            }

            const prev = this.lastPosition.coords;
            const curr = pos.coords;

            const delta = this.calculateDistance(
              prev.latitude,
              prev.longitude,
              curr.latitude,
              curr.longitude
            );

            const accuracy = curr.accuracy ?? 999;

            if (accuracy <= 30 && delta >= 1) {
              this.distance += delta;
            }

            this.lastPosition = pos;

            if (this.distance >= this.TARGET_DISTANCE) {
              this.completed = true;
              this.tracking = false;
              this.stopWatch();
              this.finish();
              return;
            }

            this.cdr.detectChanges();
          });
        }
      );
    } catch (e: any) {
      this.tracking = false;
      this.locationError = e?.message ? `Fehler: ${e.message}` : 'Fehler beim Standorttracking.';
      this.cdr.detectChanges();
    }
  }

  private stopWatch() {
    const id = this.watchId;
    this.watchId = null;

    if (!id) return;

    Geolocation.clearWatch({ id }).catch(() => { });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
      Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }
}
