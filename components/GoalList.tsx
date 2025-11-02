import React from 'react';
import { Goal } from '../types';
import GoalCard from './GoalCard';

interface GoalListProps {
  goals: Goal[];
  onDeleteGoal: (goalId: number) => void;
  onAddFunds: (goalId: number, amount: number) => void;
  onAddNewGoal: () => void;
}

const GoalList: React.FC<GoalListProps> = ({ goals, onDeleteGoal, onAddFunds, onAddNewGoal }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">Your Financial Goals</h2>
        <button 
          onClick={onAddNewGoal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors text-sm font-semibold"
        >
          + New Goal
        </button>
      </div>
      <div className="space-y-4">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onDelete={onDeleteGoal} onAddFunds={onAddFunds} />
        ))}
      </div>
    </div>
  );
};

export default GoalList;