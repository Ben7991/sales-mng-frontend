import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrearsDetailsModalComponent } from './arrears-details-modal.component';

describe('ArrearsDetailsModalComponent', () => {
  let component: ArrearsDetailsModalComponent;
  let fixture: ComponentFixture<ArrearsDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrearsDetailsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrearsDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
