import React, { useState } from 'react';
import { Goal } from '../types';
import { LogoIcon } from './icons';

interface AddGoalModalProps {
  onClose: () => void;
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({ onClose, onAddGoal }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !deadline) {
      setError('Please fill in all required fields.');
      return;
    }
    
    const newGoal = {
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      deadline,
      priority,
    };
    
    onAddGoal(newGoal);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 w-full max-w-md relative animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-6">
            <LogoIcon className="h-7 w-7 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Create a New Goal</h2>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700/30 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Goal Name</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 rounded-lg bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Target Amount (₹)</label>
                <input type="number" id="targetAmount" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} className="w-full p-2 rounded-lg bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required min="0" />
              </div>
               <div>
                <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Current Amount (₹)</label>
                <input type="number" id="currentAmount" value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} className="w-full p-2 rounded-lg bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" min="0" />
              </div>
          </div>
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Deadline</label>
            <input type="date" id="deadline" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full p-2 rounded-lg bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Priority</label>
            <div className="flex gap-2">
              {(['High', 'Medium', 'Low'] as const).map(p => (
                <button key={p} type="button" onClick={() => setPriority(p)} className={`px-3 py-1 text-sm rounded-full border transition-colors ${priority === p ? 'bg-blue-500 border-blue-500 text-white font-semibold' : 'bg-gray-100 border-gray-300 dark:bg-slate-700 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors">Save Goal</button>
          </div>
        </form>
         <style>{`
            @keyframes fade-in-up {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .animate-fade-in-up {
                animation: fade-in-up 0.3s ease-out forwards;
            }
        `}</style>
      </div>
    </div>
  );
};

export default AddGoalModal;