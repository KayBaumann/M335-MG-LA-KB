import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import {addIcons} from 'ionicons'
import {heart, star, timeOutline, trophyOutline, compassOutline, locationOutline, cameraOutline, pin, trophy } from 'ionicons/icons'

addIcons({
  'heart': heart,
  'star': star,
  'time-outline': timeOutline,
  'trophy-outline': trophyOutline,
  'compass-outline': compassOutline,
  'location-outline': locationOutline,
  'camera-outline': cameraOutline,
  'pin-filled': pin,
  'trophy-filled': trophy
})

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
