import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannignReservation } from './plannign-reservation';

describe('PlannignReservation', () => {
  let component: PlannignReservation;
  let fixture: ComponentFixture<PlannignReservation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlannignReservation],
    }).compileComponents();

    fixture = TestBed.createComponent(PlannignReservation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
