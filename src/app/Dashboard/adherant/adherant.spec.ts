import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adherant } from './adherant';

describe('Adherant', () => {
  let component: Adherant;
  let fixture: ComponentFixture<Adherant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adherant],
    }).compileComponents();

    fixture = TestBed.createComponent(Adherant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
