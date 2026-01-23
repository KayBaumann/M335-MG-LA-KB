import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { GameSessionService } from '../../session/game-session.service';
import { GameSession } from '../../session/game-session.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,   // ← *ngIf, *ngFor
    IonContent,     // ← ion-content
    IonIcon         // ← ion-icon
  ],
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  history: GameSession[] = [];

  constructor(private sessionService: GameSessionService) {}

  ngOnInit() {
    this.history = this.sessionService.getHistory();
  }

  formatDuration(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  totalPoints(s: GameSession) {
    return (s.totalSchnitzel * 10) - (s.totalPotatoes * 2);
  }
}
