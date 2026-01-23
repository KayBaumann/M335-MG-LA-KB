import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'tasks',
    loadComponent: () => import('./task-runner/task-runner.page').then( m => m.TaskRunnerPage)
  },
  {
    path: 'result-screen',
    loadComponent: () => import('./result-screen/result-screen.page').then( m => m.ResultScreenPage)
  },

];
