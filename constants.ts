import { Goal, Transaction } from './types';

export const INITIAL_GOALS: Goal[] = [
  {
    id: 1,
    name: '🌴 Hawaiian Vacation',
    targetAmount: 50000,
    currentAmount: 10000,
    deadline: '2025-06-30',
    priority: 'High',
  },
  {
    id: 2,
    name: '🚗 New Car Down Payment',
    targetAmount: 100000,
    currentAmount: 40000,
    deadline: '2025-12-31',
    priority: 'Medium',
  },
  {
    id: 3,
    name: '🚨 Emergency Fund',
    targetAmount: 150000,
    currentAmount: 90000,
    deadline: '2026-12-31',
    priority: 'High',
  },
   {
    id: 4,
    name: '💻 Tech Gadgets',
    targetAmount: 25000,
    currentAmount: 5000,
    deadline: '2024-11-30',
    priority: 'Low',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 1, category: 'Rent', description: 'Monthly Rent', amount: 2000, date: '2024-07-01' },
  { id: 2, category: 'Food', description: 'Groceries', amount: 200, date: '2024-07-03' },
  { id: 3, category: 'Shopping', description: 'New Clothes', amount: 200, date: '2024-07-05' },
];