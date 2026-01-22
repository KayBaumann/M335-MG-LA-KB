import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-wifi-task',
  standalone: true,
  imports: [NgIf, IonButton, IonIcon, IonSpinner],
  templateUrl: './wifi-task.component.html',
  styleUrls: ['./wifi-task.component.scss'],
})
export class WifiTaskComponent {

  isWifiConnected = false;
  wasConnected = false;
  wasDisconnected = false;

  completed = false;
  checking = false;
  initialLoading = true;

  private networkListener?: any;

  async checkWifiStatus() {
    this.checking = true;

    try {
      const status = await Network.getStatus();
      this.handleStatus(status);
    } finally {
      this.checking = false;
    }
  }

  private handleStatus(status: any) {
    this.isWifiConnected =
      status.connected && status.connectionType === 'wifi';

    if (this.isWifiConnected) {
      this.wasConnected = true;
    }

    if (!this.isWifiConnected && this.wasConnected) {
      this.wasDisconnected = true;
    }

    if (this.wasConnected && this.wasDisconnected) {
      this.completed = true;
    }
  }

  async ngOnInit() {
    const status = await Network.getStatus();
    this.handleStatus(status);
    this.initialLoading = false;

    this.networkListener = Network.addListener(
      'networkStatusChange',
      status => {
        if (!this.completed) {
          this.handleStatus(status);
        }
      }
    );
  }

  ngOnDestroy() {
    this.networkListener?.remove();
  }
}
