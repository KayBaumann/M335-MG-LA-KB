import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultsPage } from './result-screen.page';

describe('ResultScreenPage', () => {
  let component: ResultsPage;
  let fixture: ComponentFixture<ResultsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
