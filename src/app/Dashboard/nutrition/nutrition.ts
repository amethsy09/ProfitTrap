import { Component, signal, computed, effect, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface UserProfile {
  weight: number;     // kg
  height: number;     // cm
  age: number;        // years
  activityLevel: string;
  gender: string;
}

interface ActivityLevel {
  value: string;
  label: string;
  multiplier: number;
}

@Component({
  selector: 'app-nutrition',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './nutrition.html',
  styleUrls: ['./nutrition.css']
})
export class NutritionComponent implements OnInit {
  
  // Signaux pour le profil utilisateur
  weight = signal<number>(70);
  height = signal<number>(170);
  age = signal<number>(30);
  gender = signal<string>('male');
  activityLevel = signal<string>('moderate');
  
  // Signaux pour les résultats calculés
  bmr = signal<number>(0);
  tdee = signal<number>(0);
  dailyCalories = signal<number>(0);
  
  // Niveaux d'activité disponibles
  activityLevels: ActivityLevel[] = [
    { value: 'sedentary', label: 'Sédentaire (peu ou pas d\'exercice)', multiplier: 1.2 },
    { value: 'light', label: 'Léger (exercice 1-3 jours/semaine)', multiplier: 1.375 },
    { value: 'moderate', label: 'Modéré (exercice 3-5 jours/semaine)', multiplier: 1.55 },
    { value: 'active', label: 'Actif (exercice 6-7 jours/semaine)', multiplier: 1.725 },
    { value: 'very_active', label: 'Très actif (exercice intense quotidien)', multiplier: 1.9 }
  ];
  
  // Objectifs nutritionnels
  nutritionGoals = computed(() => {
    const calories = this.dailyCalories();
    return {
      calories: Math.round(calories),
      protein: Math.round(calories * 0.3 / 4),
      carbs: Math.round(calories * 0.5 / 4),
      fats: Math.round(calories * 0.2 / 9),
      proteinGrams: Math.round(calories * 0.3 / 4),
      carbsGrams: Math.round(calories * 0.5 / 4),
      fatsGrams: Math.round(calories * 0.2 / 9)
    };
  });
  
  // IMC calculé
  bmi = computed(() => {
    const heightInMeters = this.height() / 100;
    const bmiValue = this.weight() / (heightInMeters * heightInMeters);
    return bmiValue.toFixed(1);
  });
  
  // Statut de l'IMC
  bmiStatus = computed(() => {
    const bmi = parseFloat(this.bmi());
    if (bmi < 18.5) return { text: 'Insuffisance pondérale', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (bmi < 25) return { text: 'Poids normal', color: 'text-green-600', bg: 'bg-green-100' };
    if (bmi < 30) return { text: 'Surpoids', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { text: 'Obésité', color: 'text-red-600', bg: 'bg-red-100' };
  });
  
  constructor() {
    // Effect pour logger les changements
    effect(() => {
      const logMessage = `📊 Changement détecté: Poids=${this.weight()}kg, Taille=${this.height()}cm, Âge=${this.age()}ans, Sexe=${this.gender() === 'male' ? 'Homme' : 'Femme'}, Activité=${this.getActivityLabel(this.activityLevel())}, BMR=${Math.round(this.bmr())}cal, Besoins=${Math.round(this.dailyCalories())}cal - ${new Date().toLocaleTimeString()}`;
      
    });
  }
  
  ngOnInit() {
    this.calculateNutrition();
  }
  
  // Récupérer le label du niveau d'activité
  getActivityLabel(level: string): string {
    return this.activityLevels.find(a => a.value === level)?.label || '';
  }
  
  // Récupérer le multiplicateur du niveau d'activité
  getActivityMultiplier(level: string): number {
    return this.activityLevels.find(a => a.value === level)?.multiplier || 1.2;
  }
  
  // Calculer le métabolisme de base (BMR) - Formule de Mifflin-St Jeor
  calculateBMR(): number {
    const weight = this.weight();
    const height = this.height();
    const age = this.age();
    const isMale = this.gender() === 'male';
    
    if (isMale) {
      return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
  }
  
  // Calculer les besoins caloriques journaliers (TDEE)
  calculateTDEE(): number {
    const bmr = this.calculateBMR();
    const multiplier = this.getActivityMultiplier(this.activityLevel());
    return bmr * multiplier;
  }
  
  // Mettre à jour tous les calculs
  calculateNutrition() {
    const bmrValue = this.calculateBMR();
    const tdeeValue = this.calculateTDEE();
    
    this.bmr.set(bmrValue);
    this.tdee.set(tdeeValue);
    this.dailyCalories.set(tdeeValue);
  }
  
  // Méthodes appelées lors des changements de curseurs
  onWeightChange(value: number) {
    this.weight.set(value);
    this.calculateNutrition();
  }
  
  onHeightChange(value: number) {
    this.height.set(value);
    this.calculateNutrition();
  }
  
  onAgeChange(value: number) {
    this.age.set(value);
    this.calculateNutrition();
  }
  
  onGenderChange(value: string) {
    this.gender.set(value);
    this.calculateNutrition();
  }
  
  onActivityChange(value: string) {
    this.activityLevel.set(value);
    this.calculateNutrition();
  }
  
  // Recommandations personnalisées
  getRecommendations(): string[] {
    const calories = this.dailyCalories();
    const bmi = parseFloat(this.bmi());
    const recommendations = [];
    
    if (calories < 2000) {
      recommendations.push('📉 Vos besoins caloriques sont relativement bas. Privilégiez des aliments denses nutritionnellement.');
    } else if (calories > 3000) {
      recommendations.push('📈 Vos besoins caloriques sont élevés. Assurez-vous de manger suffisamment pour maintenir votre énergie.');
    }
    
    if (bmi < 18.5) {
      recommendations.push('🍽️ Un léger surplus calorique (+300-500 kcal/jour) pourrait vous aider à atteindre un poids santé.');
    } else if (bmi > 25) {
      recommendations.push('⚖️ Un léger déficit calorique (-300-500 kcal/jour) pourrait vous aider à atteindre un poids santé.');
    } else {
      recommendations.push('✅ Excellent maintien ! Continuez à équilibrer votre alimentation.');
    }
    
    recommendations.push('💧 N\'oubliez pas de boire environ 2L d\'eau par jour.');
    recommendations.push('🥗 Variez les sources de protéines, glucides complexes et bonnes graisses.');
    
    return recommendations;
  }
}