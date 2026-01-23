import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { GameSessionService } from '../session/game-session.service';
import { GameSession } from '../session/game-session.model';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-result-screen',
  templateUrl: './result-screen.page.html',
  styleUrls: ['./result-screen.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonButton, CommonModule, HttpClientModule],
})
export class ResultScreenPage implements OnInit {
  session: GameSession | null = null;
  submitting = false;
  submitOk = false;

  constructor(
    private sessionService: GameSessionService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.session = this.sessionService.snapshot();

    if (!this.session?.finishedAt) {
      this.router.navigate(['/home'], { replaceUrl: true });
      return;
    }
  }

  get totalPoints(): number {
    if (!this.session) return 0;
    return this.session.totalSchnitzel;
  }

  get durationParts() {
    const total = this.session?.totalDurationSec ?? 0;
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    return { hours, minutes, seconds };
  }

  formatDuration(totalSec: number): string {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  async submitToGoogleForm() {
    if (!this.session || this.submitting) return;

    this.submitting = true;
    this.submitOk = false;

    try {
      const { hours, minutes, seconds } = this.durationParts;

      const url =
        'https://docs.google.com/forms/u/0/d/e/1FAIpQLSc9v68rbCckYwcIekRLOaVZ0Qdm3eeh1xCEkgpn3d7pParfLQ/formResponse';

      const name = encodeURIComponent(this.session.name);
      const schnitzel = encodeURIComponent(String(this.session.totalSchnitzel));
      const potato = encodeURIComponent(String(this.session.totalPotatoes));
      const duration = encodeURIComponent(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );

      const body =
        `entry.1860183935=${name}` +
        `&entry.564282981=${schnitzel}` +
        `&entry.1079317865=${potato}` +
        `&entry.985590604=${duration}`;

      const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

      await firstValueFrom(this.http.post(url, body, { headers, responseType: 'text' }));
      this.submitOk = true;
    } finally {
      this.submitting = false;
    }
  }

  viewLeaderboard() {
    this.router.navigate(['/leaderboard']);
  }

  playAgain() {
    this.newRun();
  }

  newRun() {
    this.sessionService.abortSession();
    this.router.navigate(['/home'], { replaceUrl: true });
  }
}
