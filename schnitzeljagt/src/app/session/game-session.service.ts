import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TASKS } from '../tasks/tasks.data';
import { GameSession, TaskResult, TaskStatus } from './game-session.model';

const STORAGE_KEY = 'schnitzeljagd_session_v1';
const HISTORY_KEY = 'schnitzeljagd_history_v1';

@Injectable({ providedIn: 'root' })
export class GameSessionService {

  private readonly session$ = new BehaviorSubject<GameSession | null>(this.load());


  getSession() {
    return this.session$.asObservable();
  }

  snapshot(): GameSession | null {
    return this.session$.value;
  }

  startNewSession(name: string) {
    const now = Date.now();

    const tasks: TaskResult[] = TASKS.map(t => ({
      taskId: t.id,
      type: t.type,
      title: t.title,
      status: 'pending',
      schnitzelEarned: 0,
      potatoEarned: 0,
    }));

    const session: GameSession = {
      sessionId: createSessionId(),
      name: name.trim(),
      startedAt: now,
      currentTaskIndex: 0,
      totalDurationSec: 0,
      totalSchnitzel: 0,
      totalPotatoes: 0,
      tasks,
    };

    session.tasks[0].startedAt = now;

    this.set(session);
    return session;
  }

  ensureSession(nameIfMissing?: string) {
    if (this.session$.value) return this.session$.value;
    if (!nameIfMissing?.trim()) return null;
    return this.startNewSession(nameIfMissing);
  }

  startCurrentTaskIfNeeded() {
    const s = this.requireSession();
    const tr = s.tasks[s.currentTaskIndex];

    if (!tr.startedAt) {
      tr.startedAt = Date.now();
      this.recalcTotals(s);
      this.set(s);
    }
  }

  finishCurrentTask(status: Exclude<TaskStatus, 'pending'>) {
    const s = this.requireSession();
    const tr = s.tasks[s.currentTaskIndex];

    if (!tr.startedAt) tr.startedAt = Date.now();

    const finishedAt = Date.now();

    tr.finishedAt = finishedAt;
    tr.durationSec = Math.max(0, Math.round((finishedAt - tr.startedAt) / 1000));
    tr.status = status;

    tr.schnitzelEarned = status === 'completed' ? 1 : 0;
    tr.potatoEarned = tr.durationSec > 120 ? 1 : 0;

    const isLast = s.currentTaskIndex >= s.tasks.length - 1;

    if (isLast) {
      s.finishedAt = finishedAt;
      this.recalcTotals(s);

      this.saveToHistory(s); 
      this.set(s);

      return { done: true };
    }

    s.currentTaskIndex += 1;
    const next = s.tasks[s.currentTaskIndex];
    next.startedAt = Date.now();

    this.recalcTotals(s);
    this.set(s);

    return { done: false };
  }

  abortSession() {
    localStorage.removeItem(STORAGE_KEY);
    this.session$.next(null);
  }

  markSubmitted() {
    const s = this.session$.value;
    if (!s) return;

    s.submittedAt = Date.now();
    this.set(s);
  }


  getHistory(): GameSession[] {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
  }

  private saveToHistory(session: GameSession) {
    const raw = localStorage.getItem(HISTORY_KEY);
    const history: GameSession[] = raw ? JSON.parse(raw) : [];

    history.unshift({ ...session }); // neuestes zuerst
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }


  private recalcTotals(s: GameSession) {
    s.totalSchnitzel = s.tasks.reduce((a, t) => a + (t.schnitzelEarned || 0), 0);
    s.totalPotatoes = s.tasks.reduce((a, t) => a + (t.potatoEarned || 0), 0);

    const end = s.finishedAt ?? Date.now();
    s.totalDurationSec = Math.max(0, Math.round((end - s.startedAt) / 1000));
  }

  private set(s: GameSession) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    this.session$.next({ ...s });
  }

  private load(): GameSession | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as GameSession;
    } catch {
      return null;
    }
  }

  private requireSession(): GameSession {
    const s = this.session$.value;
    if (!s) throw new Error('No active session');
    return s;
  }
}


function createSessionId(): string {
  const c = globalThis.crypto as any;
  if (c?.randomUUID) return c.randomUUID();
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}
