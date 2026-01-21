import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class cameraService {
  async takePhoto() {
    const permission = await Camera.requestPermissions();

    if (permission.camera !== 'granted') {
      throw new Error('Camera permission denied');
    }

    const image = await Camera.getPhoto({
      quality: 80,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });

    return image.webPath;
  }
}
