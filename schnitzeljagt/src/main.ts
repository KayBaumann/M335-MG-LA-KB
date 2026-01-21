import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import {addIcons} from 'ionicons'
import {heart, star, timeOutline, trophyOutline, compassOutline, locationOutline, cameraOutline, pin, trophy, closeOutline, playSkipForwardOutline, checkmarkCircleOutline, navigate, locateOutline, syncOutline, footstepsOutline, navigateOutline, phonePortraitOutline, flashOutline, batteryHalfOutline, checkmarkCircle, batteryFullOutline } from 'ionicons/icons'

addIcons({
  'heart': heart,
  'star': star,
  'time-outline': timeOutline,
  'trophy-outline': trophyOutline,
  'compass-outline': compassOutline,
  'location-outline': locationOutline,
  'camera-outline': cameraOutline,
  'pin-filled': pin,
  'trophy-filled': trophy,
  'close-outline': closeOutline,
  'play-skip-forward-outline': playSkipForwardOutline,
  'checkmark-circle-outline': checkmarkCircleOutline,
  'navigate': navigate,
  'locate-atOutline': locateOutline,
  'sync-outline': syncOutline,
  'footsteps-outline': footstepsOutline,
  'navigate-outline': navigateOutline,
  'qr-code-outline': cameraOutline,
  'walk-outline': pin,
  'speedometer-outline': star,
  'flash-outline': flashOutline,
  'wifi-outline': syncOutline,
  'phone-portrait-outline': phonePortraitOutline,
  'battery-half-outline': batteryHalfOutline,
  'checkmark-circle': checkmarkCircle,
  'flash': flashOutline,
  'battery-full-outline': batteryFullOutline
})

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
