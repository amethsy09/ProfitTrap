import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Premium } from './premium';

describe('Premium', () => {
  let component: Premium;
  let fixture: ComponentFixture<Premium>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Premium],
    }).compileComponents();

    fixture = TestBed.createComponent(Premium);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
