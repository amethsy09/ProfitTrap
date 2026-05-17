import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthChart } from './health-chart';

describe('HealthChart', () => {
  let component: HealthChart;
  let fixture: ComponentFixture<HealthChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthChart],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
