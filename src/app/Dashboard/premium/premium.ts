import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-premium',
  standalone: true,
  templateUrl: './premium.html',
})
export class PremiumComponent implements AfterViewInit, OnDestroy {
  
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;
  
  private chart?: Chart;

  ngAfterViewInit() {
    this.initChart();
  }

  private initChart() {
    if (!this.chartCanvas?.nativeElement) return;
    
    const canvas = this.chartCanvas.nativeElement;

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        datasets: [
          {
            label: 'Fréquentation',
            data: [120, 200, 150, 300, 280, 400, 500],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: 'rgb(59, 130, 246)',
            pointBorderColor: 'white',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { size: 14, weight: 'bold' },
              padding: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: { size: 14 },
            bodyFont: { size: 13 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Nombre de visiteurs',
              font: { weight: 'bold', size: 12 }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Jours de la semaine',
              font: { weight: 'bold', size: 12 }
            },
            grid: {
              display: false
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }
}