import { Component, input, computed, effect, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { HealthData } from '../health.model';

Chart.register(...registerables);

@Component({
  selector: 'app-health-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './health-chart.html',
  styleUrls: ['./health-chart.css']
})
export class HealthChartComponent implements AfterViewInit, OnDestroy {
  
  // Input signals
  healthData = input<HealthData[]>([], { alias: 'data' });
  showBodyFat = input<boolean>(true);
  showMuscleMass = input<boolean>(true);
  
  @ViewChild('weightChart') weightChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('bmiChart') bmiChartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private weightChart?: Chart;
  private bmiChart?: Chart;
  
  // Données préparées
  chartData = computed(() => {
    const data = this.healthData();
    const sortedData = [...data].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    return {
      labels: sortedData.map(d => new Date(d.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })),
      weight: sortedData.map(d => d.weight),
      bmi: sortedData.map(d => d.bmi),
      bodyFat: sortedData.map(d => d.bodyFat || 0),
      muscleMass: sortedData.map(d => d.muscleMass || 0)
    };
  });
  
  // Statistiques
  stats = computed(() => {
    const data = this.chartData();
    if (data.weight.length === 0) return null;
    
    return {
      minWeight: Math.min(...data.weight),
      maxWeight: Math.max(...data.weight),
      avgWeight: data.weight.reduce((a, b) => a + b, 0) / data.weight.length,
      minBMI: Math.min(...data.bmi),
      maxBMI: Math.max(...data.bmi),
      avgBMI: data.bmi.reduce((a, b) => a + b, 0) / data.bmi.length
    };
  });
  
  constructor() {
    effect(() => {
      console.log('🔄 Graphique mis à jour:', {
        dataPoints: this.healthData().length,
        showBodyFat: this.showBodyFat(),
        showMuscleMass: this.showMuscleMass()
      });
      this.updateCharts();
    });
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.initCharts();
    }, 100);
  }
  
  private initCharts() {
    this.initWeightChart();
    this.initBMIChart();
  }
  
  private initWeightChart() {
    if (!this.weightChartCanvas?.nativeElement) return;
    
    const ctx = this.weightChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    
    const data = this.chartData();
    
    this.weightChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Poids (kg)',
          data: data.weight,
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
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.parsed.y} kg`
            }
          }
        }
      }
    });
  }
  
  private initBMIChart() {
    if (!this.bmiChartCanvas?.nativeElement) return;
    
    const ctx = this.bmiChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    
    const data = this.chartData();
    const datasets: any[] = [{
      label: 'IMC',
      data: data.bmi,
      borderColor: 'rgb(168, 85, 247)',
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: 'rgb(168, 85, 247)',
      pointBorderColor: 'white',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
      yAxisID: 'y'
    }];
    
    if (this.showBodyFat() && data.bodyFat.some(v => v > 0)) {
      datasets.push({
        label: 'Masse grasse (%)',
        data: data.bodyFat,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        borderDash: [5, 5],
        pointRadius: 4,
        yAxisID: 'y1'
      });
    }
    
    if (this.showMuscleMass() && data.muscleMass.some(v => v > 0)) {
      datasets.push({
        label: 'Masse musculaire (kg)',
        data: data.muscleMass,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        borderDash: [5, 5],
        pointRadius: 4,
        yAxisID: 'y'
      });
    }
    
    this.bmiChart = new Chart(ctx, {
      type: 'line',
      data: { labels: data.labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { position: 'top' } },
        scales: {
          y: { title: { display: true, text: 'Valeur' } },
          y1: { position: 'right', title: { display: true, text: 'Masse grasse (%)' }, grid: { drawOnChartArea: false } }
        }
      }
    });
  }
  
  private updateCharts() {
    if (!this.weightChart && !this.bmiChart) {
      this.initCharts();
      return;
    }
    
    const data = this.chartData();
    
    if (this.weightChart) {
      this.weightChart.data.labels = data.labels;
      this.weightChart.data.datasets[0].data = data.weight;
      this.weightChart.update();
    }
    
    if (this.bmiChart) {
      this.bmiChart.data.labels = data.labels;
      this.bmiChart.data.datasets[0].data = data.bmi;
      this.bmiChart.update();
    }
  }
  
  ngOnDestroy() {
    this.weightChart?.destroy();
    this.bmiChart?.destroy();
  }
}