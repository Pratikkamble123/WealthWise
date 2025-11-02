import React, { useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon, BalanceIcon, SavingsIcon, EditIcon } from './icons';

interface DashboardSummaryProps {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  availableToSave: number;
  onTotalBalanceChange: (value: number) => void;
  onMonthlyIncomeChange: (value: number) => void;
  onMonthlyExpensesChange: (value: number) => void;
  onAvailableToSaveChange: (value: number) => void;
}

const StatCard: React.FC<{ 
    title: string; 
    amount: number; 
    icon: React.ReactNode; 
    isEditable?: boolean;
    onSave?: (newAmount: number) => void;
}> = ({ title, amount, icon, isEditable = false, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(amount.toString());

    const isNegative = title === 'Monthly Expenses';
    const isPositive = title === 'Available to Save' && amount >= 0;
    const isNetNegative = title === 'Available to Save' && amount < 0;

    let amountColorClass = 'text-slate-800 dark:text-slate-100';
    if (isNegative || isNetNegative) {
        amountColorClass = 'text-red-500 dark:text-red-400';
    } else if (isPositive) {
        amountColorClass = 'text-green-500 dark:text-green-400';
    }


    const handleSave = () => {
        const newAmount = parseFloat(editValue);
        if (!isNaN(newAmount) && onSave) {
            onSave(newAmount);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setEditValue(amount.toString());
        }
    };
    
    const prefix = isNegative ? '-' : (isNetNegative ? '-' : '');
    const displayAmount = Math.abs(amount);

    const formattedAmount = prefix + '₹' + displayAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl flex items-start gap-4 border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="p-3 bg-gray-100 dark:bg-slate-700 rounded-lg">
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                {isEditing ? (
                     <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="text-2xl font-bold bg-gray-50 dark:bg-slate-700 border-b-2 border-blue-500 text-gray-800 dark:text-gray-200 w-full focus:outline-none"
                    />
                ) : (
                    <p onClick={() => isEditable && setIsEditing(true)} className={`text-2xl font-bold ${amountColorClass} ${isEditable ? 'cursor-pointer' : ''}`}>
                        {formattedAmount}
                    </p>
                )}
            </div>
            {isEditable && !isEditing && (
                <button onClick={() => setIsEditing(true)} className="text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400">
                    <EditIcon className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};


const DashboardSummary: React.FC<DashboardSummaryProps> = ({ 
    totalBalance, 
    monthlyIncome, 
    monthlyExpenses, 
    availableToSave, 
    onTotalBalanceChange, 
    onMonthlyIncomeChange,
    onMonthlyExpensesChange,
    onAvailableToSaveChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <StatCard 
        title="Total Balance" 
        amount={totalBalance} 
        icon={<BalanceIcon className="h-6 w-6 text-blue-500" />} 
        isEditable={true}
        onSave={onTotalBalanceChange}
      />
      <StatCard 
        title="Monthly Income" 
        amount={monthlyIncome} 
        icon={<ArrowUpIcon className="h-6 w-6 text-green-500" />}
        isEditable={true}
        onSave={onMonthlyIncomeChange}
      />
      <StatCard 
        title="Monthly Expenses" 
        amount={monthlyExpenses} 
        icon={<ArrowDownIcon className="h-6 w-6 text-red-500" />}
        isEditable={true}
        onSave={onMonthlyExpensesChange}
      />
      <StatCard 
        title="Available to Save" 
        amount={availableToSave} 
        icon={<SavingsIcon className="h-6 w-6 text-teal-500" />}
        isEditable={true}
        onSave={onAvailableToSaveChange}
      />
    </div>
  );
};

export default DashboardSummary;