import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'app-power-task',
  standalone: true,
  imports: [NgIf, IonButton, IonIcon, IonSpinner],
  templateUrl: './power-task.component.html',
  styleUrls: ['./power-task.component.scss'],
})
export class PowerTaskComponent {
  isCharging = false;
  batteryLevel = 75;
  completed = false;
  checking = false;

  checkPowerStatus() {
    this.checking = true;

    setTimeout(() => {
      const charging = Math.random() > 0.5;

      this.isCharging = charging;
      this.checking = false;

      if (charging) {
        this.completed = true;
      }
    }, 1500);
  }
}
