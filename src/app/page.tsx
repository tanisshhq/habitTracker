
"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { enUS } from 'date-fns/locale';

// Mock Data
const initialHabits = [
  { id: 'water', name: 'Drink Water', goal: 8, unit: 'glasses', progress: [0, 0, 0, 0, 0, 0, 0] },
  { id: 'sleep', name: 'Sleep', goal: 8, unit: 'hours', progress: [0, 0, 0, 0, 0, 0, 0] },
  { id: 'screenTime', name: 'Limit Screen Time', goal: 2, unit: 'hours', progress: [0, 0, 0, 0, 0, 0, 0] },
  { id: 'exercise', name: 'Exercise', goal: 30, unit: 'minutes', progress: [0, 0, 0, 0, 0, 0, 0] },
];

const useRandomUser = () => {
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    fetch('https://randomuser.me/api/')
      .then((response) => response.json())
      .then((data) => setAvatarUrl(data.results[0].picture.large))
      .catch((error) => console.error('Error fetching random user:', error));
  }, []);

  return avatarUrl;
};

const App: React.FC = () => {
  const [habits, setHabits] = useState(initialHabits);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const avatarUrl = useRandomUser();

  const start = startOfWeek(currentWeek, { locale: enUS });
  const end = endOfWeek(currentWeek, { locale: enUS });
  const weekDays = Array.from({ length: 7 }, (_, i) => format(addDays(start, i), 'EEE', { locale: enUS }));

  const updateHabitProgress = (habitId: string, dayIndex: number, value: number) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === habitId ? { ...habit, progress: habit.progress.map((p, i) => (i === dayIndex ? value : p)) } : habit
      )
    );
  };

  const setHabitGoal = (habitId: string, newGoal: number) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => (habit.id === habitId ? { ...habit, goal: newGoal } : habit))
    );
  };

  const navigateWeek = (offset: number) => {
    setCurrentWeek((prevWeek) => {
      const newDate = new Date(prevWeek);
      newDate.setDate(newDate.getDate() + offset * 7);
      return newDate;
    });
  };

  const getWeeklyData = (habit: { name: string; progress: number[] }) => {
    return habit.progress.map((value, index) => ({
      day: weekDays[index],
      [habit.name]: value,
    }));
  };

  const getTotalCompletedDays = (progress: number[], goal: number) => {
    return progress.filter((p) => p >= goal).length;
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased">
      {/* Navigation Bar */}
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-md sticky top-0 z-10"
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <span className="font-bold text-xl text-indigo-600">Personal Analytics</span>
          <div className="flex items-center space-x-4">
            <button onClick={() => {}} className="hover:text-gray-600 transition duration-300">
              Dashboard
            </button>
            <button onClick={toggleSettings} className="hover:text-gray-600 transition duration-300">
              Settings
            </button>
            {avatarUrl && (
              <motion.img
                src={avatarUrl}
                alt="User Avatar"
                className="w-8 h-8 rounded-full cursor-pointer"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </div>
        </div>
      </motion.nav>

      {/* Landing Page / Dashboard */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="container mx-auto p-6"
      >
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Week at a Glance</h2>
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => navigateWeek(-1)} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <h3 className="text-lg font-medium text-gray-700">{format(start, 'MMM d')} - {format(end, 'MMM d, yyyy')}</h3>
            <button onClick={() => navigateWeek(1)} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414l4-4a1 1 0 010-1.414l-4-4a1 1 0 01-1.414 1.414L12.586 9l-3.293 3.293a1 1 0 011.414 1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {habits.map((habit) => (
            <div key={habit.id} className="mb-6 p-4 rounded-md shadow-sm bg-white border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-700">{habit.name}</h4>
                <span className="text-sm text-gray-500">{getTotalCompletedDays(habit.progress, habit.goal)} / 7 Days</span>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={getWeeklyData(habit)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey={habit.name} stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 flex items-center space-x-4">
                {habit.progress.map((value, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <span className="text-xs text-gray-600">{weekDays[index]}</span>
                    <input
                      type="number"
                      min={0}
                      max={habit.goal * 2}
                      className="w-16 text-center border border-gray-300 rounded-md py-1 text-sm"
                      value={value}
                      onChange={(e) => updateHabitProgress(habit.id, index, parseInt(e.target.value))}
                    />
                    <span className="text-xs text-gray-500">/{habit.goal} {habit.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.main>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-20"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Settings</h2>
              {habits.map((habit) => (
                <div key={habit.id} className="mb-4">
                  <label htmlFor={`goal-${habit.id}`} className="block text-gray-700 text-sm font-bold mb-2">
                    {habit.name} Goal ({habit.unit}):
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      id={`goal-${habit.id}`}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={habit.goal}
                      onChange={(e) => setHabitGoal(habit.id, parseInt(e.target.value))}
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <button onClick={toggleSettings} className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-200 py-4 text-center text-gray-600 text-sm"
      >
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} Personal Analytics. All rights reserved.
        </div>
      </motion.footer>
    </div>
  );
};

export default App;