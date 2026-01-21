import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

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

  private intervalId: any;

  readonly HOLD_DURATION = 3;

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
    this.intervalId = setInterval(() => {
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
    clearInterval(this.intervalId);
    this.holdTime = 0;
  }

  private complete() {
    clearInterval(this.intervalId);
    this.completed = true;

    setTimeout(() => {
      // onComplete Callback
      console.log('Task completed');
    }, 800);
  }

  get progressPercent() {
    return (this.holdTime / this.HOLD_DURATION) * 100;
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
