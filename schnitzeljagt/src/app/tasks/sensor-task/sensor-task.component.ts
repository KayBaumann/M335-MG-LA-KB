import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { Motion } from '@capacitor/motion';
import { PluginListenerHandle } from '@capacitor/core';

@Component({
  selector: 'app-sensor-task',
  templateUrl: './sensor-task.component.html',
  styleUrls: ['./sensor-task.component.scss'],
  imports: [CommonModule, IonIcon],
})
export class SensorTaskComponent implements OnDestroy {

  isUpsideDown = false;
  holdTime = 0;
  completed = false;

  readonly HOLD_DURATION = 3;

  private motionListener?: PluginListenerHandle;
  private holdInterval?: any;

  toggleOrientation() {
    if (this.completed) return;

    this.isUpsideDown = !this.isUpsideDown;

    if (this.isUpsideDown) {
      this.startHoldTimer();
    } else {
      this.reset();
    }
  }

  private startHoldTimer() {
    if (this.holdInterval) return;

    this.holdInterval = setInterval(() => {
      this.holdTime = Math.min(
        this.holdTime + 0.1,
        this.HOLD_DURATION
      );

      if (this.holdTime >= this.HOLD_DURATION) {
        this.complete();
      }
    }, 100);
  }

  private reset() {
    clearInterval(this.holdInterval);
    this.holdInterval = undefined;
    this.holdTime = 0;
  }


  private complete() {
    clearInterval(this.holdInterval);
    this.holdInterval = undefined;
    this.completed = true;

    console.log('Task completed');
  }

  get progressPercent() {
    return (this.holdTime / this.HOLD_DURATION) * 100;
  }

  ngOnDestroy() {
    this.motionListener?.remove();
    clearInterval(this.holdInterval);
  }

  async ngOnInit() {
    this.motionListener = await Motion.addListener(
      'accel',
      event => {
        if (this.completed) return;

        const y = event.accelerationIncludingGravity?.y ?? 0;
        const upsideDown = y < -7;

        if (upsideDown !== this.isUpsideDown) {
          this.isUpsideDown = upsideDown;

          if (upsideDown) {
            this.startHoldTimer();
          } else {
            this.reset();
          }
        }
      }
    );
  }
}
