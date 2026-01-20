import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent , IonIcon, CommonModule, FormsModule, IonIcon],
})
export class HomePage {
  constructor() {}

  showPermissions = false;

  cameraPermission = false;
  locationPermission = false;

  name = '';



  startGame(){
    console.log("Game Started");
  }

  startClick(){
    console.log("Start button clicked");
  }

  viewHistory(){
    console.log("View History clicked");
  }

  viewLeaderboard(){
    console.log("View Leaderboard clicked");
  }

  requestPermissions(){
    console.log("Request Permissions clicked");
  }



}
