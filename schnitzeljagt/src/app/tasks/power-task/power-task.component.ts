import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { Device } from '@capacitor/device';
import { PluginListenerHandle } from '@capacitor/core';


@Component({
  selector: 'app-power-task',
  standalone: true,
  imports: [NgIf, IonButton, IonIcon, IonSpinner],
  templateUrl: './power-task.component.html',
  styleUrls: ['./power-task.component.scss'],
})
export class PowerTaskComponent {

  private batteryInterval?: any;

  isCharging = false;
  batteryLevel = 75;
  completed = false;
  checking = false;
  initialLoading = true;


  async checkPowerStatus() {
    this.checking = true;

    try {
      const battery = await Device.getBatteryInfo();

      this.isCharging = battery.isCharging ?? false;
      this.batteryLevel = battery.batteryLevel !== undefined
        ? Math.round(battery.batteryLevel * 100)
        : 0;

      if (this.isCharging) {
        this.completed = true;
      }
    } finally {
      this.checking = false;
    }
  }

  private async loadInitialBatteryStatus() {
    try {
      const battery = await Device.getBatteryInfo();

      this.isCharging = battery.isCharging ?? false;
      this.batteryLevel = battery.batteryLevel !== undefined
        ? Math.round(battery.batteryLevel * 100)
        : 0;

      if (this.isCharging) {
        this.completed = true;
      }
    } finally {
      this.initialLoading = false;
    }
  }



  ngOnInit() {
    this.loadInitialBatteryStatus();

    this.batteryInterval = setInterval(() => {
      if (!this.completed && !this.initialLoading) {
        this.checkPowerStatus();
      }
    }, 3000);
  }

  ngOnDestroy() {
    clearInterval(this.batteryInterval);
  }
}
