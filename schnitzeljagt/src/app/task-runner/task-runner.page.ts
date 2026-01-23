// task-runner.page.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

import { GeolocationTaskComponent } from '../tasks/geolocation-task/geolocation-task.component';
import { DistanceTaskComponent } from '../tasks/distance-task/distance-task.component';
import { SensorTaskComponent } from '../tasks/sensor-task/sensor-task.component';
import { QrTaskComponent } from '../tasks/qr-task/qr-task.component';
import { PowerTaskComponent } from '../tasks/power-task/power-task.component';
import { WifiTaskComponent } from '../tasks/wifi-task/wifi-task.component';

import { TASKS } from '../tasks/tasks.data';
import { GameSessionService } from '../session/game-session.service';
import { GameSession } from '../session/game-session.model';

@Component({
  selector: 'app-task-runner',
  templateUrl: './task-runner.page.html',
  styleUrls: ['./task-runner.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonIcon,
    GeolocationTaskComponent,
    DistanceTaskComponent,
    SensorTaskComponent,
    QrTaskComponent,
    PowerTaskComponent,
    WifiTaskComponent
  ]
})



export class TaskRunnerPage implements OnInit, OnDestroy {
  private sub?: Subscription;
  private tick?: any;

  session: GameSession | null = null;

  elapsed = 0;

  constructor(
    private router: Router,
    private sessionService: GameSessionService
  ) { }

  private async hapticSuccess() {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch { }
  }
  ngOnInit() {
    this.sub = this.sessionService.getSession().subscribe(s => {
      this.session = s;
      if (!s) {
        this.router.navigate(['/home'], { replaceUrl: true });
        return;
      }
      this.sessionService.startCurrentTaskIfNeeded();
      this.recalcElapsed();
    });

    this.tick = setInterval(() => this.recalcElapsed(), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.tick);
    this.sub?.unsubscribe();
  }

  private recalcElapsed() {
    const s = this.session;
    if (!s) return;

    const current = s.tasks[s.currentTaskIndex];
    const start = current.startedAt ?? Date.now();
    this.elapsed = Math.max(0, Math.round((Date.now() - start) / 1000));
  }

  get task() {
    if (!this.session) return TASKS[0];
    return TASKS[this.session.currentTaskIndex];
  }

  get taskNumber(): number {
    return (this.session?.currentTaskIndex ?? 0) + 1;
  }

  get totalTasks(): number {
    return TASKS.length;
  }

  get progress(): number {
    return (this.taskNumber / this.totalTasks) * 100;
  }

  get taskIcon(): string {
    switch (this.task.type) {
      case 'geolocation': return 'navigate-outline';
      case 'qr': return 'qr-code-outline';
      case 'distance': return 'walk-outline';
      case 'sensor': return 'speedometer-outline';
      case 'power': return 'flash-outline';
      case 'wifi': return 'wifi-outline';
      default: return 'help-outline';
    }
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  abort() {
    this.sessionService.abortSession();
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  skip() {
    const res = this.sessionService.finishCurrentTask('skipped');
    if (res.done) this.finishRun();
  }

  complete() {
    const res = this.sessionService.finishCurrentTask('completed');

    this.hapticSuccess().finally(() => {
      if (res.done) this.finishRun();
    });
  }

  private finishRun() {
    this.router.navigate(['/result-screen'], { replaceUrl: true });
  }
}
