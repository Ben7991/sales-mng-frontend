import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePswFormComponent } from './change-psw-form.component';

describe('ChangePswFormComponent', () => {
  let component: ChangePswFormComponent;
  let fixture: ComponentFixture<ChangePswFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePswFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePswFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
