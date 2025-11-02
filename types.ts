export interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface Transaction {
  id: number;
  category: string;
  description: string;
  amount: number;
  date: string;
}

export interface Distribution {
  name: string;
  value: number;
}

export enum Mood {
    NEUTRAL = 'Neutral',
    STRESSED = 'Stressed',
    CONFIDENT = 'Confident',
    HOPEFUL = 'Hopeful',
}
