import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestockDetailComponent } from './restock-detail.component';

describe('RestockDetailComponent', () => {
  let component: RestockDetailComponent;
  let fixture: ComponentFixture<RestockDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestockDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestockDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
