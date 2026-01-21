import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class locationService {
  async requestLocation() {
    const permission = await Geolocation.requestPermissions();

    if (permission.location !== 'granted') {
      throw new Error('Location permission denied');
    }

    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    });

    return position;
  }
}
