import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Distribution } from '../types';

interface FundDistributionChartProps {
  data: Distribution[];
}

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'];


const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 p-2 border border-gray-200 dark:border-slate-700 rounded-md shadow-lg">
        <p className="text-gray-700 dark:text-gray-200">{`${payload[0].name} : ₹${payload[0].value.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</p>
      </div>
    );
  }
  return null;
};

const FundDistributionChart: React.FC<FundDistributionChartProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md h-96 border border-gray-200 dark:border-slate-700">
      <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Current Savings Allocation</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend iconSize={10} wrapperStyle={{ fontSize: '14px', bottom: -10 }}/>
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <p>No savings allocated to goals yet.</p>
        </div>
      )}
    </div>
  );
};

export default FundDistributionChart;