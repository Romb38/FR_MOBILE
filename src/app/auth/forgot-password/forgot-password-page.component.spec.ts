import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordPageComponent } from './forgot-password-page.component';

describe('ForgotPasswordPage', () => {
  let component: ForgotPasswordPageComponent;
  let fixture: ComponentFixture<ForgotPasswordPageComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
