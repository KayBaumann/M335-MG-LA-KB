import { EventEmitter, Output, Directive } from '@angular/core';

@Directive()
export abstract class BaseTask {
    @Output() completedChange = new EventEmitter<boolean>();

    protected finish() {
        this.completedChange.emit(true);
    }
}