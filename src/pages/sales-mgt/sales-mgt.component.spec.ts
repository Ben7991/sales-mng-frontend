import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesMgtComponent } from './sales-mgt.component';

describe('SalesMgtComponent', () => {
  let component: SalesMgtComponent;
  let fixture: ComponentFixture<SalesMgtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesMgtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesMgtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
