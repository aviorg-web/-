import React, { useState, useEffect, useCallback } from 'react';
import type { Topic, Difficulty } from '../types';
import { generateExplanation } from '../services/geminiService';

interface LearnViewProps {
  topic: Topic;
  difficulty: Difficulty;
  onStartPractice: () => void;
  onBack: () => void;
}

const LearnView: React.FC<LearnViewProps> = ({ topic, difficulty, onStartPractice, onBack }) => {
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchExplanation = useCallback(async () => {
    setIsLoading(true);
    setExplanation('');
    const result = await generateExplanation(topic, difficulty);
    setExplanation(result);
    setIsLoading(false);
  }, [topic, difficulty]);

  useEffect(() => {
    fetchExplanation();
  }, [fetchExplanation]);

  return (
    <div className="flex flex-col h-full bg-white/70 backdrop-blur-sm rounded-2xl shadow-2xl shadow-sky-200/50">
      <header className="p-4 border-b border-sky-100 bg-sky-50/70 rounded-t-2xl flex justify-between items-center">
        <h2 className="text-2xl font-bold text-sky-800">לומדים: {topic}</h2>
        <button onClick={onBack} className="text-sm bg-white hover:bg-slate-50 text-slate-600 font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-sm border border-slate-200">
          מסך הבית
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
                <div className="inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 text-lg">טוען הסבר ודוגמה...</p>
            </div>
          </div>
        ) : (
          <div className="prose prose-lg max-w-none text-right whitespace-pre-wrap leading-relaxed text-gray-800">
            {explanation}
          </div>
        )}
      </div>
      
      <footer className="p-6 bg-sky-50/70 border-t border-sky-100 rounded-b-2xl flex justify-center items-center gap-4">
        <button 
          onClick={fetchExplanation} 
          disabled={isLoading}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-px disabled:bg-orange-300 disabled:cursor-not-allowed"
        >
          דוגמה נוספת
        </button>
        <button 
          onClick={onStartPractice} 
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-px disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          נמשיך לתרגול
        </button>
      </footer>
    </div>
  );
};

export default LearnView;