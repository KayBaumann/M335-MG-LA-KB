import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Geolocation } from '@capacitor/geolocation';
import { Camera } from '@capacitor/camera';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent , IonIcon, CommonModule, FormsModule, IonIcon],
})
export class HomePage {
  constructor(
    
    private router: Router
  ) {}

  showPermissions = false;

  cameraPermission = false;
  locationPermission = false;

  name = '';



  startGame(){
    this.router.navigate(['/tasks']);
  }

  startClick(){
    if (!this.name.trim()) return;
    this.showPermissions = true;
  }

  viewHistory(){
    console.log("View History clicked");
  }

  viewLeaderboard(){
    console.log("View Leaderboard clicked");
  }

  requestPermissions(){
    this.locationPermission = true;
    this.cameraPermission = true;
  }



}
