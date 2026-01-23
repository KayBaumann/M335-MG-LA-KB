import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { BaseTask } from '../base-task/base-task';
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerTypeHintALLOption
} from '@capacitor/barcode-scanner';

const TARGET_QR_CONTENT = 'djsdgzoezkhdkdgvkiwehtiugfi';

@Component({
  selector: 'app-qr-task',
  standalone: true,
  imports: [CommonModule, IonIcon],
  templateUrl: './qr-task.component.html',
})
export class QrTaskComponent extends BaseTask implements OnDestroy {
  scanning = false;
  scannedContent: string | null = null; 
  completed = false;

  lastResult: string | null = null;
  errorMessage: string | null = null;

  private finishTimeoutId: any;

  constructor() {
    super();
  }

  async scanQR() {
    if (this.scanning || this.completed) return;

    this.scanning = true;
    this.errorMessage = null;
    this.scannedContent = null;

    try {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHintALLOption.ALL
      });

      const content = result?.ScanResult ?? null;

      if (!content) {
        this.errorMessage = 'Kein QR Code erkannt. Bitte erneut scannen.';
        return;
      }

      this.lastResult = content;
      this.scannedContent = content;

      if (content === TARGET_QR_CONTENT) {
        this.completed = true;

        this.finishTimeoutId = setTimeout(() => {
          this.finish();
        }, 800);
      } else {
        this.errorMessage = 'Falscher QR Code. Bitte scanne den richtigen Code.';
      }
    } catch (e) {
      this.errorMessage = 'Scan abgebrochen oder Kamera nicht verfügbar.';
    } finally {
      this.scanning = false;
    }
  }

  get isCorrect() {
    return this.scannedContent === TARGET_QR_CONTENT;
  }

  ngOnDestroy() {
    clearTimeout(this.finishTimeoutId);
  }
}
