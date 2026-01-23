import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
import { IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { Network, NetworkStatus } from '@capacitor/network';
import { App } from '@capacitor/app';
import { IntentLauncher, ActivityAction } from '@capgo/capacitor-intent-launcher';
import { BaseTask } from '../base-task/base-task';
import { PluginListenerHandle } from '@capacitor/core';


@Component({
  selector: 'app-wifi-task',
  standalone: true,
  imports: [NgIf, IonButton, IonIcon, IonSpinner],
  templateUrl: './wifi-task.component.html',
  styleUrls: ['./wifi-task.component.scss'],
})
export class WifiTaskComponent extends BaseTask implements OnInit, OnDestroy {

  isWifiConnected = false;

  wasConnected = false;
  wasDisconnected = false;

  expectedAction: 'connect' | 'disconnect' = 'connect';

  completed = false;
  initialLoading = true;

  private networkListener?: PluginListenerHandle;
  private appStateListener?: PluginListenerHandle;

  constructor() {
    super();
  }

  async ngOnInit() {
    const status = await Network.getStatus();
    this.updateState(status);
    this.initialLoading = false;

    this.networkListener = await Network.addListener('networkStatusChange', status => {
      if (!this.completed) this.updateState(status);
    });

    this.appStateListener = await App.addListener('appStateChange', async (state) => {
      if (state.isActive && !this.completed) {
        const latest = await Network.getStatus();
        this.updateState(latest);
      }
    });
  }

  ngOnDestroy() {
    this.networkListener?.remove();
    this.networkListener = undefined;

    this.appStateListener?.remove();
    this.appStateListener = undefined;
  }

  private updateState(status: NetworkStatus) {
    const isWifi = status.connected && status.connectionType === 'wifi';
    this.isWifiConnected = isWifi;

    if (this.expectedAction === 'connect' && isWifi) {
      this.wasConnected = true;
      this.expectedAction = 'disconnect';
    }

    if (this.expectedAction === 'disconnect' && !isWifi && this.wasConnected) {
      this.wasDisconnected = true;
      if (!this.completed) {
        this.completed = true;
        this.onCompleted();
      }
    }
  }

  private onCompleted() {
    this.networkListener?.remove();
    this.appStateListener?.remove();

    this.finish();
  }

  async toggleWifi() {
    if (this.completed) return;

    try {
      await IntentLauncher.startActivityAsync({
        action: 'android.settings.panel.action.WIFI',
      } as any);
    } catch {
      await IntentLauncher.startActivityAsync({
        action: ActivityAction.WIFI_SETTINGS,
      });
    }
  }

  get toggleButtonText(): string {
    return this.expectedAction === 'connect' ? 'WLAN einschalten' : 'WLAN ausschalten';
  }

  get toggleIconName(): string {
    return this.expectedAction === 'connect' ? 'wifi' : 'wifi-off';
  }
}
