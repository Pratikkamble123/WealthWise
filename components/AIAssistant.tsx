import React, { useState, useCallback } from 'react';
import { Goal, Distribution, Mood } from '../types';
import { getDistributionSuggestion, runScenarioSimulation, getMoodBasedTip } from '../services/geminiService';
import { AIBrainIcon, ScenarioIcon, MoodIcon } from './icons';

interface AIAssistantProps {
  goals: Goal[];
  income: number;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ goals, income }) => {
  const [activeTab, setActiveTab] = useState('advisor');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Advisor State
  const [advisorResult, setAdvisorResult] = useState<Distribution[] | null>(null);
  
  // Scenario State
  const [scenarioInput, setScenarioInput] = useState('');
  const [scenarioResult, setScenarioResult] = useState<string | null>(null);
  
  // Mood State
  const [selectedMood, setSelectedMood] = useState<Mood>(Mood.NEUTRAL);
  const [moodTip, setMoodTip] = useState<string | null>(null);

  const handleGetDistribution = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAdvisorResult(null);
    try {
      const result = await getDistributionSuggestion(income, goals);
      setAdvisorResult(result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [income, goals]);

  const handleRunSimulation = useCallback(async () => {
    if (!scenarioInput.trim()) {
        setError("Please enter a scenario.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setScenarioResult(null);
    try {
        const result = await runScenarioSimulation(scenarioInput, goals, advisorResult || []);
        setScenarioResult(result);
    } catch (e: any) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  }, [scenarioInput, goals, advisorResult]);

  const handleGetMoodTip = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setMoodTip(null);
    try {
        const result = await getMoodBasedTip(selectedMood, goals);
        setMoodTip(result);
    } catch (e: any) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  }, [selectedMood, goals]);

  const renderContent = () => {
    switch (activeTab) {
      case 'advisor':
        return (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Get an AI-optimized fund distribution plan based on your income and goals.</p>
            <button onClick={handleGetDistribution} disabled={isLoading} className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed">
              {isLoading ? 'Analyzing...' : 'Generate Smart Plan'}
            </button>
            {advisorResult && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-700">
                <h4 className="font-bold text-lg text-blue-600 dark:text-blue-400 mb-2">Suggested Monthly Distribution:</h4>
                <ul className="space-y-2">
                  {advisorResult.map((item, index) => (
                    <li key={index} className="flex justify-between items-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700/50 p-2 rounded">
                      <span>{item.name}</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">₹{item.value.toLocaleString('en-IN')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        );
      case 'scenario':
        return (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Test "what if" situations to see how they impact your financial goals.</p>
            <textarea
                value={scenarioInput}
                onChange={(e) => setScenarioInput(e.target.value)}
                placeholder="e.g., If I increase my monthly savings by 10%..."
                className="w-full p-2 rounded-lg bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                rows={3}
            />
            <button onClick={handleRunSimulation} disabled={isLoading} className="mt-2 w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold disabled:bg-green-400 disabled:cursor-not-allowed">
                {isLoading ? 'Simulating...' : 'Run Simulation'}
            </button>
             {scenarioResult && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-700">
                 <h4 className="font-bold text-lg text-green-600 dark:text-green-400 mb-2">Simulation Result:</h4>
                <div className="prose dark:prose-invert text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: scenarioResult.replace(/\n/g, '<br />') }}></div>
              </div>
            )}
          </>
        );
      case 'mood':
        return (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-4">How are you feeling about your finances today? Get a personalized tip.</p>
            <div className="flex gap-2 mb-4 flex-wrap">
                {Object.values(Mood).map(mood => (
                    <button key={mood} onClick={() => setSelectedMood(mood)} className={`px-3 py-1 text-sm rounded-full border transition-colors ${selectedMood === mood ? 'bg-yellow-400 border-yellow-500 text-slate-800 font-semibold' : 'bg-gray-200 border-gray-300 dark:bg-slate-700 dark:border-slate-600 hover:bg-gray-300 dark:hover:bg-slate-600'}`}>
                        {mood}
                    </button>
                ))}
            </div>
            <button onClick={handleGetMoodTip} disabled={isLoading} className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-semibold disabled:bg-yellow-400 disabled:cursor-not-allowed">
                {isLoading ? 'Thinking...' : 'Get My Tip'}
            </button>
            {moodTip && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/30 rounded-lg italic text-center">
                <p className="text-yellow-800 dark:text-yellow-300">"{moodTip}"</p>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="mt-8 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <AIBrainIcon className="h-8 w-8 text-blue-500" />
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">AI Financial Assistant</h2>
      </div>
      
      <div className="flex border-b border-gray-200 dark:border-slate-700 mb-6">
        <TabButton id="advisor" activeTab={activeTab} setActiveTab={setActiveTab} icon={<AIBrainIcon className="h-5 w-5"/>}>Smart Advisor</TabButton>
        <TabButton id="scenario" activeTab={activeTab} setActiveTab={setActiveTab} icon={<ScenarioIcon className="h-5 w-5"/>}>Scenario Simulator</TabButton>
        <TabButton id="mood" activeTab={activeTab} setActiveTab={setActiveTab} icon={<MoodIcon className="h-5 w-5"/>}>Mood Manager</TabButton>
      </div>
      
      <div>
        {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700/30 rounded-lg">{error}</div>}
        {renderContent()}
      </div>
    </div>
  );
};

const TabButton: React.FC<{id: string, activeTab: string, setActiveTab: (id: string) => void, children: React.ReactNode, icon: React.ReactNode}> = ({id, activeTab, setActiveTab, children, icon}) => {
    const isActive = activeTab === id;
    const activeClasses = 'border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-semibold';
    const inactiveClasses = 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600';
    return (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors focus:outline-none ${isActive ? activeClasses : inactiveClasses}`}
        >
            {icon}
            {children}
        </button>
    );
};

export default AIAssistant;