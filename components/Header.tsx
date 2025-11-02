import React, { useState, useEffect, useRef } from 'react';
import { LogoIcon, SunIcon, MoonIcon } from './icons';
import { Goal } from '../types';

// Fix: Define USER_PROFILE_IMAGE_BASE64 as a placeholder.
const USER_PROFILE_IMAGE_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2EwYTVhZSI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTAgMTRjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+PC9zdmc+';

interface HeaderProps {
  upcomingGoals: Goal[];
  theme: string;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ upcomingGoals, theme, toggleTheme }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const daysLeft = (deadline: string) => Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <header className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <LogoIcon className="h-8 w-8 text-blue-500" />
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          WealthWise
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
            {theme === 'light' ? (
                <MoonIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            ) : (
                <SunIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            )}
        </button>
        <div className="relative" ref={notificationRef}>
          <button onClick={toggleNotifications} className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V4a2 2 0 10-4 0v1.341A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              {upcomingGoals.length > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
          </button>
          {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-10 animate-fade-in-down">
                  <div className="p-3 border-b border-gray-200 dark:border-slate-700">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100">Notifications</h4>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                      {upcomingGoals.length > 0 ? (
                          <ul>
                              {upcomingGoals.map(goal => (
                                  <li key={goal.id} className="p-3 hover:bg-gray-100 dark:hover:bg-slate-700 border-b border-gray-200 dark:border-slate-700 last:border-b-0">
                                      <p className="font-semibold text-blue-500 dark:text-blue-400 text-sm">Deadline Approaching!</p>
                                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Your goal "<span className="font-medium">{goal.name}</span>" is due in {daysLeft(goal.deadline)} day(s).</p>
                                  </li>
                              ))}
                          </ul>
                      ) : (
                          <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                              You're all caught up!
                          </div>
                      )}
                  </div>
              </div>
          )}
        </div>
        <img src={USER_PROFILE_IMAGE_BASE64} alt="User" className="h-10 w-10 rounded-full border-2 border-gray-300 dark:border-slate-600 object-cover" />
      </div>
      <style>{`
          @keyframes fade-in-down {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-down { animation: fade-in-down 0.2s ease-out forwards; }
      `}</style>
    </header>
  );
};

export default Header;
