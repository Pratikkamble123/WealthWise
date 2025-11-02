import React, { useState, useMemo, useEffect } from 'react';
import { Goal, Transaction, Distribution } from './types';
import { INITIAL_GOALS, INITIAL_TRANSACTIONS } from './constants';
import Header from './components/Header';
import DashboardSummary from './components/DashboardSummary';
import FundDistributionChart from './components/FundDistributionChart';
import GoalList from './components/GoalList';
import AIAssistant from './components/AIAssistant';
import AddGoalModal from './components/AddGoalModal';

const App: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [totalBalance, setTotalBalance] = useState(4600);
  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(4500);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const availableToSave = monthlyIncome - monthlyExpenses;

  const topSpendingCategories = useMemo(() => {
    const spendingByCategory: { [key: string]: number } = {};
    transactions.forEach(t => {
      spendingByCategory[t.category] = (spendingByCategory[t.category] || 0) + t.amount;
    });

    return Object.entries(spendingByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, amount]) => ({ name, amount }));
  }, [transactions]);

  const fundDistributionData = useMemo(() => {
    return goals
      .map(goal => ({
        name: goal.name,
        value: goal.currentAmount,
      }))
      .filter(d => d.value > 0); // Only show goals with existing savings
  }, [goals]);
  
    const upcomingGoals = useMemo(() => {
    const now = new Date().getTime();
    return goals.filter(goal => {
      const deadlineTime = new Date(goal.deadline).getTime();
      const timeLeft = deadlineTime - now;
      // Calculate days left, rounding up to the nearest whole day
      const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
      // A goal is "upcoming" if the deadline is in 1, 2, or 3 days
      return daysLeft > 0 && daysLeft <= 3;
    });
  }, [goals]);

  const categoryToEmoji: { [key: string]: string } = {
    'Shopping': '🛍️',
    'Food': '🍽️',
    'Rent': '🏠',
    'Savings': '💰',
    'Groceries': '🛒',
    'Restaurant': '🍜',
    // Add more mappings as needed
  };
  
  const handleAddNewGoal = (newGoal: Omit<Goal, 'id'>) => {
    setGoals(prevGoals => [
      ...prevGoals,
      {
        ...newGoal,
        id: prevGoals.length > 0 ? Math.max(...prevGoals.map(g => g.id)) + 1 : 1,
      }
    ]);
    setIsModalOpen(false);
  };

  const handleDeleteGoal = (goalId: number) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  }

  const handleAddFundsToGoal = (goalId: number, amount: number) => {
    if (amount <= 0) return;
    if (amount > totalBalance) {
      alert("Insufficient funds in Total Balance.");
      return;
    }
    
    // Update balance and goal's current amount
    setTotalBalance(prevBalance => prevBalance - amount);
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === goalId
          ? { ...goal, currentAmount: goal.currentAmount + amount }
          : goal
      )
    );

    // Create a new transaction for this savings action
    const goalName = goals.find(g => g.id === goalId)?.name || 'a goal';
    const newTransaction: Transaction = {
      id: Date.now(),
      category: 'Savings',
      description: `Contribution to ${goalName}`,
      amount: amount,
      date: new Date().toISOString(),
    };
    setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
    setMonthlyExpenses(prevExpenses => prevExpenses + amount);
  };

  const handleAvailableToSaveChange = (newAvailable: number) => {
    const newExpenses = monthlyIncome - newAvailable;
    setMonthlyExpenses(newExpenses);
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-slate-900 dark:text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header upcomingGoals={upcomingGoals} theme={theme} toggleTheme={toggleTheme} />
        <main className="mt-8">
          <DashboardSummary
            totalBalance={totalBalance}
            monthlyIncome={monthlyIncome}
            monthlyExpenses={monthlyExpenses}
            availableToSave={availableToSave}
            onTotalBalanceChange={setTotalBalance}
            onMonthlyIncomeChange={setMonthlyIncome}
            onMonthlyExpensesChange={setMonthlyExpenses}
            onAvailableToSaveChange={handleAvailableToSaveChange}
          />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <GoalList goals={goals} onDeleteGoal={handleDeleteGoal} onAddFunds={handleAddFundsToGoal} onAddNewGoal={() => setIsModalOpen(true)} />
            </div>
            <div className="space-y-8">
              <FundDistributionChart data={fundDistributionData} />
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700">
                  <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Top Spending Categories</h3>
                  <ul className="space-y-3">
                      {topSpendingCategories.map(category => (
                        <li key={category.name} className="flex justify-between items-center text-gray-700 dark:text-gray-300">
                          <span>{categoryToEmoji[category.name] || '💸'} {category.name}</span> 
                          <span className="font-medium text-red-500">
                            -₹{category.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </li>
                      ))}
                  </ul>
              </div>
            </div>
          </div>
          
          <AIAssistant 
            goals={goals} 
            income={monthlyIncome} 
          />
        </main>
        
        {isModalOpen && (
          <AddGoalModal 
            onClose={() => setIsModalOpen(false)} 
            onAddGoal={handleAddNewGoal} 
          />
        )}
      </div>
    </div>
  );
};

export default App;