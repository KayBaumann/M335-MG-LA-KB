import { Component, OnDestroy } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { DecimalPipe } from '@angular/common';
import { Geolocation, Position } from '@capacitor/geolocation';


@Component({
  selector: 'app-distance-task',
  standalone: true,
  imports: [
    IonButton,
    IonIcon,
    DecimalPipe
  ],
  templateUrl: './distance-task.component.html',
  styleUrls: ['./distance-task.component.scss']
})
export class DistanceTaskComponent implements OnDestroy {
  readonly TARGET_DISTANCE = 10;

  tracking = false;
  distance = 0;

  private watchId?: string;
  private lastPosition?: Position;

  get progress(): number {
    return Math.min((this.distance / this.TARGET_DISTANCE) * 100, 100);
  }

  async startTracking() {
    if (this.tracking) return;

    this.tracking = true;

    this.watchId = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      },
      position => {
        if (!position) return;

        if (this.lastPosition) {
          const delta = this.calculateDistance(
            this.lastPosition.coords.latitude,
            this.lastPosition.coords.longitude,
            position.coords.latitude,
            position.coords.longitude
          );

          // GPS-Rauschen filtern (unter 1m ignorieren)
          if (delta > 1) {
            this.distance += delta;
          }
        }

        this.lastPosition = position;
      }
    );
  }

  pauseTracking() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = undefined;
    }

    this.tracking = false;
  }

  ngOnDestroy() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
    }
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371000; // Meter
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
