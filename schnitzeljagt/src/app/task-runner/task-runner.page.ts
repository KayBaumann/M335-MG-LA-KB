import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon} from '@ionic/angular/standalone';
import { GeolocationTaskComponent } from '../tasks/geolocation-task/geolocation-task.component';
import { DistanceTaskComponent } from '../tasks/distance-task/distance-task.component';

@Component({
  selector: 'app-task-runner',
  templateUrl: './task-runner.page.html',
  styleUrls: ['./task-runner.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonIcon, GeolocationTaskComponent, DistanceTaskComponent]
})
export class TaskRunnerPage implements OnInit {

  constructor() { }

  taskNumber = 1;
  totalTasks = 5;

  elapsed = 0;
  private timer?: any;

  task = {
    title: 'Finde den richtigen Ort',
    description: 'Begebe dich zu dem markierten Punkt auf der Karte.',
    type: 'geolocation',
    required: true,
  };

  ngOnInit() {
    this.timer = setInterval(() => {
      this.elapsed++;
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  get progress(): number {
    return (this.taskNumber / this.totalTasks) * 100;
  }

  get taskIcon(): string {
    switch (this.task.type) {
      case 'geolocation':
        return 'navigate-outline';
      case 'qr':
        return 'qr-code-outline';
      case 'distance':
        return 'walk-outline';
      case 'sensor':
        return 'speedometer-outline';
      case 'power':
        return 'flash-outline';
      case 'wifi':
        return 'wifi-outline';
      default:
        return 'help-outline';
    }
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  abort() {
    console.log('aborted');
  }

  skip() {
    this.taskNumber++;
  }

  complete() {
    console.log('completed');
  }

}
