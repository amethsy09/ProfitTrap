import { Component, signal, computed, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HealthChartComponent } from './health-chart/health-chart';
import { HealthData, HealthStats, HealthGoal } from './health.model';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [CommonModule, FormsModule, HealthChartComponent],
  templateUrl: './health.html',
  styleUrls: ['./health.css']
})
export class HealthComponent implements OnInit {
  
  // Données de santé
  healthData = signal<HealthData[]>([
    {
      id: 1,
      date: new Date('2024-01-15'),
      weight: 85,
      height: 175,
      bmi: 27.8,
      bodyFat: 25,
      muscleMass: 35,
      notes: 'Début du programme'
    },
    {
      id: 2,
      date: new Date('2024-02-15'),
      weight: 82,
      height: 175,
      bmi: 26.8,
      bodyFat: 23.5,
      muscleMass: 36,
      notes: 'Progression positive'
    },
    {
      id: 3,
      date: new Date('2024-03-15'),
      weight: 79,
      height: 175,
      bmi: 25.8,
      bodyFat: 22,
      muscleMass: 37,
      notes: 'Objectif en vue'
    },
    {
      id: 4,
      date: new Date('2024-04-15'),
      weight: 76,
      height: 175,
      bmi: 24.8,
      bodyFat: 20.5,
      muscleMass: 38,
      notes: 'Excellent progrès'
    },
    {
      id: 5,
      date: new Date('2024-05-15'),
      weight: 74,
      height: 175,
      bmi: 24.2,
      bodyFat: 19,
      muscleMass: 39,
      notes: 'Objectif atteint !'
    }
  ]);

  // Nouvelle mesure
  newMeasurement = signal<Partial<HealthData>>({
    date: new Date(),
    weight: 0,
    height: 175,
    bodyFat: 0,
    muscleMass: 0,
    notes: ''
  });

  // Objectifs de santé
  healthGoal = signal<HealthGoal>({
    targetWeight: 70,
    targetBMI: 22.9,
    deadline: new Date('2024-12-31')
  });

  // Filtres
  selectedPeriod = signal<string>('all');
  showBodyFat = signal<boolean>(true);
  showMuscleMass = signal<boolean>(true);
  
  // Notification
  notification = signal<{ show: boolean; message: string; type: string }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Mode d'édition
  editingId = signal<number | null>(null);
  editForm = signal<Partial<HealthData>>({});

  constructor() {
    effect(() => {
      console.log('📊 Données de santé mises à jour:', {
        total: this.healthData().length,
        currentWeight: this.currentWeight(),
        currentBMI: this.currentBMI(),
        timestamp: new Date().toLocaleTimeString()
      });
    });
  }

  ngOnInit() {
    this.updateFilteredData();
  }

  // Données filtrées
  filteredData = computed(() => {
    const data = this.healthData();
    const period = this.selectedPeriod();
    const now = new Date();
    
    if (period === 'all') return data;
    
    const months = period === '3months' ? 3 : period === '6months' ? 6 : 12;
    const cutoffDate = new Date(now.setMonth(now.getMonth() - months));
    
    return data.filter(item => new Date(item.date) >= cutoffDate);
  });

  // Statistiques
  healthStats = computed((): HealthStats => {
    const data = this.filteredData();
    if (data.length === 0) {
      return {
        currentWeight: 0,
        initialWeight: 0,
        weightChange: 0,
        currentBMI: 0,
        initialBMI: 0,
        bmiChange: 0,
        bestBMI: 0,
        worstBMI: 0,
        averageBMI: 0,
        totalMeasurements: 0
      };
    }
    
    const sortedData = [...data].sort((a, b) => a.date.getTime() - b.date.getTime());
    const first = sortedData[0];
    const last = sortedData[sortedData.length - 1];
    const bmis = data.map(d => d.bmi);
    
    return {
      currentWeight: last.weight,
      initialWeight: first.weight,
      weightChange: last.weight - first.weight,
      currentBMI: last.bmi,
      initialBMI: first.bmi,
      bmiChange: last.bmi - first.bmi,
      bestBMI: Math.min(...bmis),
      worstBMI: Math.max(...bmis),
      averageBMI: bmis.reduce((a, b) => a + b, 0) / bmis.length,
      totalMeasurements: data.length
    };
  });

  // Valeurs actuelles
  currentWeight = computed(() => {
    const data = this.healthData();
    return data.length > 0 ? data[data.length - 1].weight : 0;
  });

  currentBMI = computed(() => {
    const data = this.healthData();
    return data.length > 0 ? data[data.length - 1].bmi : 0;
  });

  // Progression vers l'objectif
  progressToGoal = computed(() => {
    const current = this.currentWeight();
    const target = this.healthGoal().targetWeight;
    const initial = this.healthStats().initialWeight;
    const totalChange = initial - target;
    const currentChange = initial - current;
    
    if (totalChange <= 0) return 0;
    return Math.min(100, Math.max(0, (currentChange / totalChange) * 100));
  });

  // Méthodes pour newMeasurement
  updateNewMeasurementDate(dateStr: string) {
    this.newMeasurement.update(v => ({ ...v, date: new Date(dateStr) }));
  }

  updateNewMeasurementWeight(weight: number) {
    this.newMeasurement.update(v => ({ ...v, weight: weight }));
  }

  updateNewMeasurementHeight(height: number) {
    this.newMeasurement.update(v => ({ ...v, height: height }));
  }

  updateNewMeasurementBodyFat(bodyFat: number) {
    this.newMeasurement.update(v => ({ ...v, bodyFat: bodyFat }));
  }

  updateNewMeasurementMuscleMass(muscleMass: number) {
    this.newMeasurement.update(v => ({ ...v, muscleMass: muscleMass }));
  }

  // Méthodes pour editForm
  updateEditFormDate(dateStr: string) {
    this.editForm.update(v => ({ ...v, date: new Date(dateStr) }));
  }

  updateEditFormWeight(weight: number) {
    this.editForm.update(v => ({ ...v, weight: weight }));
  }

  updateEditFormHeight(height: number) {
    this.editForm.update(v => ({ ...v, height: height }));
  }

  updateEditFormBodyFat(bodyFat: number) {
    this.editForm.update(v => ({ ...v, bodyFat: bodyFat }));
  }

  updateEditFormMuscleMass(muscleMass: number) {
    this.editForm.update(v => ({ ...v, muscleMass: muscleMass }));
  }

  updateEditFormNotes(notes: string) {
    this.editForm.update(v => ({ ...v, notes: notes }));
  }

  // Calculer l'IMC
  calculateBMI(weight: number, height: number): number {
    const heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  // Ajouter une mesure
  addMeasurement() {
    const measurement = this.newMeasurement();
    
    if (!measurement.weight || measurement.weight <= 0) {
      this.showNotification('Veuillez entrer un poids valide', 'error');
      return;
    }
    
    if (!measurement.height || measurement.height <= 0) {
      this.showNotification('Veuillez entrer une taille valide', 'error');
      return;
    }
    
    const bmi = this.calculateBMI(measurement.weight, measurement.height);
    
    const newId = Math.max(...this.healthData().map(d => d.id), 0) + 1;
    const newData: HealthData = {
      id: newId,
      date: measurement.date || new Date(),
      weight: measurement.weight,
      height: measurement.height,
      bmi: bmi,
      bodyFat: measurement.bodyFat,
      muscleMass: measurement.muscleMass,
      notes: measurement.notes
    };
    
    this.healthData.update(data => [...data, newData]);
    this.newMeasurement.set({
      date: new Date(),
      weight: 0,
      height: 175,
      bodyFat: 0,
      muscleMass: 0,
      notes: ''
    });
    
    this.showNotification('Mesure ajoutée avec succès !', 'success');
  }

  // Modifier une mesure
  editMeasurement(id: number) {
    const measurement = this.healthData().find(d => d.id === id);
    if (measurement) {
      this.editingId.set(id);
      this.editForm.set({ ...measurement });
    }
  }

  // Sauvegarder la modification
  saveEdit() {
    const id = this.editingId();
    const editedData = this.editForm();
    
    if (!id) return;
    
    const bmi = this.calculateBMI(editedData.weight!, editedData.height!);
    
    this.healthData.update(data =>
      data.map(item =>
        item.id === id
          ? { ...item, ...editedData, bmi }
          : item
      )
    );
    
    this.editingId.set(null);
    this.editForm.set({});
    this.showNotification('Mesure modifiée avec succès !', 'success');
  }

  // Supprimer une mesure
  deleteMeasurement(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette mesure ?')) {
      this.healthData.update(data => data.filter(item => item.id !== id));
      this.showNotification('Mesure supprimée', 'info');
    }
  }

  // Annuler l'édition
  cancelEdit() {
    this.editingId.set(null);
    this.editForm.set({});
  }

  // Classes CSS pour IMC
  getBMIClass(bmi: number): string {
    if (bmi < 18.5) return 'text-yellow-600 bg-yellow-100';
    if (bmi < 25) return 'text-green-600 bg-green-100';
    if (bmi < 30) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  }

  getBMILabel(bmi: number): string {
    if (bmi < 18.5) return 'Insuffisance pondérale';
    if (bmi < 25) return 'Poids normal';
    if (bmi < 30) return 'Surpoids';
    return 'Obésité';
  }

  getWeightChangeClass(change: number): string {
    if (change < 0) return 'text-green-600';
    if (change > 0) return 'text-red-600';
    return 'text-gray-600';
  }

  getWeightChangeIcon(change: number): string {
    if (change < 0) return '📉';
    if (change > 0) return '📈';
    return '➡️';
  }

  updateFilteredData() {
    this.selectedPeriod.set(this.selectedPeriod());
  }

  // Exporter les données
  exportData() {
    const data = this.healthData();
    const csvContent = [
      ['ID', 'Date', 'Poids (kg)', 'Taille (cm)', 'IMC', 'Masse grasse (%)', 'Masse musculaire (kg)', 'Notes'].join(','),
      ...data.map(d => [
        d.id,
        d.date.toLocaleDateString(),
        d.weight,
        d.height,
        d.bmi,
        d.bodyFat || '',
        d.muscleMass || '',
        `"${d.notes || ''}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    this.showNotification('Données exportées avec succès !', 'success');
  }

  showNotification(message: string, type: string) {
    this.notification.set({ show: true, message, type });
    setTimeout(() => {
      this.notification.set({ show: false, message: '', type: 'success' });
    }, 3000);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}