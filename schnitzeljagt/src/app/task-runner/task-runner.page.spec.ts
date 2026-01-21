import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskRunnerPage } from './task-runner.page';

describe('TaskRunnerPage', () => {
  let component: TaskRunnerPage;
  let fixture: ComponentFixture<TaskRunnerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskRunnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
