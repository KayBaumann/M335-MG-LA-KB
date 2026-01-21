import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-task-runner',
  templateUrl: './task-runner.page.html',
  styleUrls: ['./task-runner.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TaskRunnerPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
