import {
  Component,
  ViewChild,
  ElementRef,
  afterNextRender
} from '@angular/core';

import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-premium',
  standalone: true,
  templateUrl: './premium.html',
})
export class PremiumComponent {

  @ViewChild('chartCanvas')
  chartCanvas?: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;
  private initialized = false;

  constructor() {

    afterNextRender(() => {
      this.tryInitChart();
    });

  }

  private tryInitChart() {

    const canvas = this.chartCanvas?.nativeElement;

    if (!canvas || this.initialized) return;

    this.initialized = true;

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [
          {
            label: 'Fréquentation',
            data: [120, 200, 150, 300, 280, 400, 500],
            borderWidth: 2,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

    setTimeout(() => {
      this.chart?.resize();
    }, 0);
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }
}