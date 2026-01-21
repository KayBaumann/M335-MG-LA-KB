import { Component } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { DecimalPipe } from '@angular/common';

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
export class DistanceTaskComponent {
  readonly TARGET_DISTANCE = 20;

  tracking = false;
  distance = 0;

  get progress(): number {
    return Math.min((this.distance / this.TARGET_DISTANCE) * 100, 100);
  }

  startTracking() {
    this.tracking = true;
  }

  pauseTracking() {
    this.tracking = false;
  }
}
