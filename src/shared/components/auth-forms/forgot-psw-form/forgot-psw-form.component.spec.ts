import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPswFormComponent } from './forgot-psw-form.component';

describe('ForgotPswFormComponent', () => {
  let component: ForgotPswFormComponent;
  let fixture: ComponentFixture<ForgotPswFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPswFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPswFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
