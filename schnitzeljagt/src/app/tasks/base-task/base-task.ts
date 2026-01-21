import { EventEmitter, Output, Directive } from '@angular/core';

@Directive()
export abstract class BaseTask {
    @Output() complete = new EventEmitter<void>();

    protected finish() {
        this.complete.emit();
    }
}
