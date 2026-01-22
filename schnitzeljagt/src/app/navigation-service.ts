import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { getDistance } from 'geolib';

type LatLng = { latitude: number; longitude: number };

@Injectable({ providedIn: 'root' })
export class NavigationService {
  async ensurePermissions(): Promise<void> {
    const status = await Geolocation.checkPermissions();

    if (status.location === 'granted' || status.coarseLocation === 'granted') {
      return;
    }

    const req = await Geolocation.requestPermissions({
      permissions: ['location', 'coarseLocation'],
    });

    const ok =
      req.location === 'granted' || req.coarseLocation === 'granted';

    if (!ok) {
      throw new Error('Location permission not granted');
    }
  }

  async getCurrentPosition(): Promise<LatLng> {
    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: false,  // Start with network/wifi location
      maximumAge: 30000,
      timeout: 10000,
    });

    return this.mapPosition(pos);
  }

  async watchPosition(
    callback: (pos: LatLng, raw: Position) => void,
    onError?: (err: unknown) => void
  ): Promise<string> {
    const id = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      },
      (position, err) => {
        if (err) {
          onError?.(err);
          return;
        }
        if (!position) {
          onError?.(new Error('No position returned'));
          return;
        }

        callback(this.mapPosition(position), position);
      }
    );

    return id;
  }

  clearWatch(watchId: string) {
    Geolocation.clearWatch({ id: watchId });
  }

  getDistanceMeters(from: LatLng, to: LatLng): number {
    return getDistance(from, to);
  }

  private mapPosition(pos: Position): LatLng {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    return { latitude: lat, longitude: lng };
  }
}
