import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

const TARGET_QR_CONTENT = 'SCHNITZELJAGD_2026_M335';

@Component({
  selector: 'app-qr-task',
  standalone: true,
  imports: [CommonModule, IonIcon],
  templateUrl: './qr-task.component.html',
})
export class QrTaskComponent implements OnDestroy {

  scanning = false;
  scannedContent: string | null = null;
  completed = false;

  private timeoutId: any;

  simulateScan() {
    if (this.scanning || this.completed) return;

    this.scanning = true;
    this.scannedContent = null;

    this.timeoutId = setTimeout(() => {
      const isCorrect = Math.random() > 0.3;
      this.scannedContent = isCorrect
        ? TARGET_QR_CONTENT
        : 'WRONG_QR_CODE';

      this.scanning = false;

      if (isCorrect) {
        setTimeout(() => {
          this.completed = true;
          console.log('QR Task completed');
        }, 1200);
      }
    }, 2000);
  }

  get isCorrect() {
    return this.scannedContent === TARGET_QR_CONTENT;
  }

  ngOnDestroy() {
    clearTimeout(this.timeoutId);
  }
}
