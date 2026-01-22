import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { GeolocationTaskComponent } from '../tasks/geolocation-task/geolocation-task.component';
import { DistanceTaskComponent } from '../tasks/distance-task/distance-task.component';
import { SensorTaskComponent } from '../tasks/sensor-task/sensor-task.component';
import { QrTaskComponent } from '../tasks/qr-task/qr-task.component';
import { PowerTaskComponent } from '../tasks/power-task/power-task.component';
import { WifiTaskComponent } from '../tasks/wifi-task/wifi-task.component';
import { Task } from '../models/task.model';
import { Router } from '@angular/router';



@Component({
  selector: 'app-task-runner',
  templateUrl: './task-runner.page.html',
  styleUrls: ['./task-runner.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonIcon, GeolocationTaskComponent, DistanceTaskComponent, SensorTaskComponent, QrTaskComponent, PowerTaskComponent, WifiTaskComponent]
})
export class TaskRunnerPage implements OnInit {

  constructor(private router: Router) { }

  tasks: Task[] = [
    {
      id: '1',
      title: 'Finde den Standort',
      description: 'Begib dich zum vorgegebenen Koordinaten. GPS-Genauigkeit: 20 Meter Umkreis.',
      type: 'geolocation',
    },
    {
      id: '2',
      title: 'Gehe eine besvffrftimmte Distanz',
      description: 'Bewege dich mindestens 20 Meter.',
      type: 'distance',
    },
    {
      id: '3',
      title: 'Gerät auf den kopf',
      description: 'Drehe dein Gerät auf den Kopf für 3 Sekunden',
      type: 'sensor',
    },
    {
      id: '4',
      title: 'Scanne den QR-Code',
      description: 'Finde und scanne den versteckten QR-Code um fortzufahren.',
      type: 'qr',
    },
    {
      id: '6',
      title: 'WLAN Verbindungsaufgabe',
      description: 'Verbinde dich mit einem WLAN-Netzwerk und trenne die Verbindung wieder.',
      type: 'wifi',
    },
    {
      id: '5',
      title: 'Gerät aufladen',
      description: 'Verbinde dein Gerät mit dem Strom oder einem Ladekabel.',
      type: 'power',
    }
  ];

  currentTaskIndex = 0;

  elapsed = 0;
  private timer?: any;

  ngOnInit() {
    this.timer = setInterval(() => {
      this.elapsed++;
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  get task(): Task {
    return this.tasks[this.currentTaskIndex];
  }

  get progress(): number {
    return (this.taskNumber / this.totalTasks) * 100;
  }

  get taskNumber(): number {
    return this.currentTaskIndex + 1;
  }

  get totalTasks(): number {
    return this.tasks.length;
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
    this.complete();
  }

  complete() {
    if (this.currentTaskIndex < this.tasks.length - 1) {
      this.currentTaskIndex++;
      return;
    }

    // letzte Task erledigt → nächste Page
    this.finishRun();
  }


  finishRun() {
    this.router.navigate(['/summary'], { replaceUrl: true });
  }

}
