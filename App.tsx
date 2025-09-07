import React, { useState, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import ChatView from './components/ChatView';
import LearnView from './components/LearnView';
import type { UserData, Topic, Difficulty, BadgeId } from './types';
import { Topic as TopicEnum, BadgeId as BadgeIdEnum } from './types';


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'learn' | 'chat'>('dashboard');
  const [sessionConfig, setSessionConfig] = useState<{ topic: Topic; difficulty: Difficulty } | null>(null);
  
  // Mock user data state - score starts at 0
  const [userData, setUserData] = useState<UserData>({
    score: 0,
    badges: [BadgeIdEnum.DISTRIBUTIVE_CHAMP],
    solvedProblems: {
        [TopicEnum.ALGEBRAIC_EXPRESSIONS]: 5,
        [TopicEnum.COMBINING_LIKE_TERMS]: 2,
        [TopicEnum.SOLVING_EQUATIONS]: 8
    },
    dailyChallenges: 2,
    consecutiveDays: 14,
  });

  const checkAndAwardBadges = useCallback((newUserData: UserData): BadgeId[] => {
      const newBadges: BadgeId[] = [];
      
      // Example logic for "Equation Master"
      if (newUserData.solvedProblems[TopicEnum.SOLVING_EQUATIONS] >= 10 && !newUserData.badges.includes(BadgeIdEnum.EQUATION_MASTER)) {
          newBadges.push(BadgeIdEnum.EQUATION_MASTER);
      }
      // Example logic for "Legality King"
      if (newUserData.dailyChallenges >= 3 && !newUserData.badges.includes(BadgeIdEnum.LEGALITY_KING)) {
          newBadges.push(BadgeIdEnum.LEGALITY_KING);
      }
      // Example logic for "Persistent Genius"
      if (newUserData.consecutiveDays >= 15 && !newUserData.badges.includes(BadgeIdEnum.PERSISTENT_GENIUS)) {
          newBadges.push(BadgeIdEnum.PERSISTENT_GENIUS);
      }

      return newBadges;
  }, []);

  const handleStartSession = (topic: Topic, difficulty: Difficulty) => {
    setSessionConfig({ topic, difficulty });
    setCurrentView('learn');
  };
  
  const handleStartPractice = () => {
    setCurrentView('chat');
  };

  const handleSessionEnd = useCallback((points: number, topic: Topic) => {
    setUserData(prevData => {
      const updatedSolvedProblems = {
          ...prevData.solvedProblems,
          [topic]: (prevData.solvedProblems[topic] || 0) + 1,
      };

      const newData = {
          ...prevData,
          score: prevData.score + points,
          solvedProblems: updatedSolvedProblems,
      };

      const newlyAwardedBadges = checkAndAwardBadges(newData);
      if (newlyAwardedBadges.length > 0) {
          // Here you could show a notification to the user
          console.log("New badges awarded:", newlyAwardedBadges);
          return {
              ...newData,
              badges: [...newData.badges, ...newlyAwardedBadges],
          };
      }
      
      return newData;
    });
  }, [checkAndAwardBadges]);
  
  const handleBackToDashboard = () => {
    setSessionConfig(null);
    setCurrentView('dashboard');
  };

  const renderContent = () => {
    if (!sessionConfig || currentView === 'dashboard') {
        return <Dashboard userData={userData} onStartSession={handleStartSession} />;
    }
    
    switch(currentView) {
        case 'learn':
            return <LearnView 
                      topic={sessionConfig.topic} 
                      difficulty={sessionConfig.difficulty} 
                      onStartPractice={handleStartPractice}
                      onBack={handleBackToDashboard}
                   />;
        case 'chat':
            return <ChatView 
                      topic={sessionConfig.topic} 
                      difficulty={sessionConfig.difficulty} 
                      onSessionEnd={handleSessionEnd}
                      onBack={handleBackToDashboard}
                   />;
        default:
            return <Dashboard userData={userData} onStartSession={handleStartSession} />;
    }
}
  
  return (
    <main className="bg-gradient-to-br from-sky-50 to-green-100 min-h-screen w-full flex items-center justify-center font-['Assistant',_sans-serif]">
        <div className="container mx-auto p-4 h-screen max-h-[90vh] w-full max-w-5xl">
            {renderContent()}
        </div>
    </main>
  );
};

export default App;