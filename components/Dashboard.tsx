import React, { useState } from 'react';
import { Topic, Difficulty, type UserData } from '../types';
import { BADGES, TOPICS_CONFIG, DIFFICULTIES_CONFIG } from '../constants';

interface DashboardProps {
  userData: UserData;
  onStartSession: (topic: Topic, difficulty: Difficulty) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userData, onStartSession }) => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setSelectedDifficulty(null); // Reset difficulty when topic changes
  };

  return (
    <div className="p-8 max-w-4xl mx-auto text-center">
      <header className="mb-10">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400 mb-2">המאמן המתמטי</h1>
        <p className="text-xl text-gray-500">הדרך שלך להצטיין באלגברה</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg shadow-yellow-200/50">
          <h3 className="text-2xl font-bold text-gray-700 mb-4">הכוכבים שלי</h3>
          <div className="flex justify-center items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-yellow-400 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <p className="text-7xl font-bold text-gray-700">{userData.score}</p>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg shadow-sky-200/50">
          <h3 className="text-2xl font-bold text-gray-700 mb-4">ההישגים שלי</h3>
          <div className="flex justify-center items-center gap-4">
            {Object.values(BADGES).map(badge => (
              <div key={badge.id} className="group relative" title={badge.description}>
                <div className={`p-2 rounded-full transition-all duration-300 transform group-hover:scale-110 ${userData.badges.includes(badge.id) ? 'bg-yellow-100 grayscale-0' : 'bg-gray-200 grayscale'}`}>
                  {badge.icon}
                </div>
                <span className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {badge.name}: {badge.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-2xl shadow-sky-200/50">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">בואו נתחיל תרגיל חדש!</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">1. בחר נושא:</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {TOPICS_CONFIG.map(topic => (
                <button 
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic.id)}
                  className={`font-semibold py-2 px-5 rounded-full transition transform hover:scale-105 ${
                    selectedTopic === topic.id 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' 
                    : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                  }`}
                >
                  {topic.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className={`transition-opacity duration-500 ${selectedTopic ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">2. בחר רמת קושי:</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {DIFFICULTIES_CONFIG.map(diff => (
                <button 
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  disabled={!selectedTopic}
                  className={`font-semibold py-2 px-5 rounded-full transition transform hover:scale-105 ${
                    selectedDifficulty === diff.id
                    ? 'bg-violet-500 text-white shadow-lg shadow-violet-200'
                    : 'bg-violet-100 text-violet-800 hover:bg-violet-200'
                  } disabled:cursor-not-allowed`}
                >
                  {diff.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-4">
             <button
                onClick={() => onStartSession(selectedTopic!, selectedDifficulty!)}
                disabled={!selectedTopic || !selectedDifficulty}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-4 px-10 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
             >
                המשך
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;