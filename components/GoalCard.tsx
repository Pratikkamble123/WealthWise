import React, { useState } from 'react';
import { Goal } from '../types';
import { TrashIcon } from './icons';

interface GoalCardProps {
  goal: Goal;
  onDelete: (goalId: number) => void;
  onAddFunds: (goalId: number, amount: number) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onDelete, onAddFunds }) => {
  const [addAmount, setAddAmount] = useState('');
  const progress = (goal.currentAmount / goal.targetAmount) * 100;

  const getPriorityClass = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-400 dark:border-red-700/50';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-400 dark:border-yellow-700/50';
      case 'Low': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-400 dark:border-blue-700/50';
    }
  };

  const handleAddFunds = () => {
    const amount = parseFloat(addAmount);
    if (!isNaN(amount) && amount > 0) {
      onAddFunds(goal.id, amount);
      setAddAmount('');
    }
  };

  const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className='flex-1'>
            <div className="flex items-start justify-between">
                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 pr-4">{goal.name}</h4>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getPriorityClass(goal.priority)}`}>
                        {goal.priority}
                    </span>
                    <button onClick={() => onDelete(goal.id)} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
             <div className="flex items-baseline space-x-2 mt-2">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{goal.currentAmount.toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">of ₹{goal.targetAmount.toLocaleString('en-IN')}</p>
            </div>
        </div>
        
        <div className="w-full sm:w-1/3 text-left sm:text-right">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 mt-2">
                <input
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="Add funds (₹)"
                    className="bg-gray-100 dark:bg-slate-700 text-xs p-1 rounded w-28 border border-gray-300 dark:border-slate-600 dark:text-gray-200 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <button
                    onClick={handleAddFunds}
                    className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 text-xs px-2 py-1 rounded hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors font-semibold"
                >
                    Save
                </button>
            </div>
            <p className="text-right text-xs mt-1 text-gray-500 dark:text-gray-400">{progress.toFixed(1)}% complete</p>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;