export interface HealthData {
  id: number;
  date: Date;
  weight: number;
  height: number;
  bmi: number;
  bodyFat?: number;
  muscleMass?: number;
  notes?: string;
}

export interface HealthStats {
  currentWeight: number;
  initialWeight: number;
  weightChange: number;
  currentBMI: number;
  initialBMI: number;
  bmiChange: number;
  bestBMI: number;
  worstBMI: number;
  averageBMI: number;
  totalMeasurements: number;
}

export interface HealthGoal {
  targetWeight: number;
  targetBMI: number;
  deadline: Date;
}