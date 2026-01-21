import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Motion } from '@capacitor/motion';
import { getDistance, getGreatCircleBearing } from 'geolib';

@Injectable({ providedIn: 'root' })
export class NavigationService {

  async getCurrentPosition() {
    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true
    });

    return {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    };
  }

  watchHeading(callback: (heading: number) => void) {
    Motion.addListener('orientation', event => {
      if (event.alpha != null) {
        callback(event.alpha);
      }
    });
  }

  getDistanceMeters(from: any, to: any): number {
    return getDistance(from, to);
  }

  getBearingDegrees(from: any, to: any): number {
    return getGreatCircleBearing(from, to);
  }
}
