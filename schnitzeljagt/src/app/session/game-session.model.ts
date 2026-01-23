import { Task } from '../models/task.model';

export type TaskStatus = 'pending' | 'completed' | 'skipped';

export interface TaskResult {
    taskId: string;
    type: Task['type'];
    title: string;
    status: TaskStatus;

    startedAt?: number; 
    finishedAt?: number; 
    durationSec?: number;

    schnitzelEarned: number;
    potatoEarned: number;
}

export interface GameSession {
    sessionId: string;
    name: string;

    startedAt: number;
    finishedAt?: number;
    submittedAt?: number;

    currentTaskIndex: number;

    totalDurationSec: number;
    totalSchnitzel: number;
    totalPotatoes: number;

    tasks: TaskResult[];
}
