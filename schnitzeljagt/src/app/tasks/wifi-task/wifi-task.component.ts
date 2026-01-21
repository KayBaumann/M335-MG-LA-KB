import { Component, OnInit, OnDestroy } from '@angular/core';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-wifi-task',
  templateUrl: './wifi-task.component.html',
  styleUrls: ['./wifi-task.component.scss']
})
export class WifiTaskComponent implements OnInit, OnDestroy {

  wasConnected = false;
  wasDisconnected = false;
  taskCompleted = false;

  private listener: any;

  async ngOnInit() {
    // Initialer Status
    const status = await Network.getStatus();
    this.handleStatus(status);

    // Listener für Änderungen
    this.listener = Network.addListener(
      'networkStatusChange',
      status => this.handleStatus(status)
    );
  }

  handleStatus(status: any) {
    if (status.connected && status.connectionType === 'wifi') {
      this.wasConnected = true;
    }

    if (!status.connected && this.wasConnected) {
      this.wasDisconnected = true;
    }

    if (this.wasConnected && this.wasDisconnected) {
      this.taskCompleted = true;
      this.onTaskCompleted();
    }
  }

  onTaskCompleted() {
    console.log('WLAN Task abgeschlossen');
  }

  ngOnDestroy() {
    if (this.listener) {
      this.listener.remove();
    }
  }
}
