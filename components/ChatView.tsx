import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Topic, Difficulty, ChatMessage } from '../types';
import { generateProblem, evaluateAnswer, getHint } from '../services/geminiService';
import Message from './Message';

interface ChatViewProps {
  topic: Topic;
  difficulty: Difficulty;
  onSessionEnd: (points: number, topic: Topic) => void;
  onBack: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ topic, difficulty, onSessionEnd, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentProblem, setCurrentProblem] = useState('');
  const [hintCount, setHintCount] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [problemHistory, setProblemHistory] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Handles requests for subsequent problems after the first one.
  const startNewProblem = useCallback(async () => {
    setIsLoading(true);
    setMessages([]);
    setIsSolved(false);
    setHintCount(0);
    const initialBotMessage: ChatMessage = { id: Date.now(), sender: 'bot', text: '', isThinking: true };
    setMessages([initialBotMessage]);
    
    const problem = await generateProblem(topic, difficulty, problemHistory);
    setCurrentProblem(problem);
    setProblemHistory(prev => [...prev, problem]); // Add the new problem to the history
    setMessages([{ ...initialBotMessage, text: problem, isThinking: false }]);
    setIsLoading(false);
  }, [topic, difficulty, problemHistory]);

  // Fetches the very first problem when the view loads or the session changes.
  // This also resets the problem history for the new session.
  useEffect(() => {
    const fetchFirstProblem = async () => {
        setIsLoading(true);
        setMessages([]);
        setIsSolved(false);
        setHintCount(0);
        const initialBotMessage: ChatMessage = { id: Date.now(), sender: 'bot', text: '', isThinking: true };
        setMessages([initialBotMessage]);
        
        const problem = await generateProblem(topic, difficulty); // History is implicitly empty
        setCurrentProblem(problem);
        setProblemHistory([problem]); // Reset history with the first problem
        setMessages([{ ...initialBotMessage, text: problem, isThinking: false }]);
        setIsLoading(false);
    };

    fetchFirstProblem();
    // This effect should only re-run when the topic or difficulty changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, difficulty]);


  const submitAnswer = async () => {
    if (!userInput.trim() || isLoading || isSolved) return;

    const userMessage: ChatMessage = { id: Date.now(), sender: 'user', text: userInput.trim() };
    const thinkingMessage: ChatMessage = { id: Date.now() + 1, sender: 'bot', text: '', isThinking: true };

    setMessages(prev => [...prev, userMessage, thinkingMessage]);
    setUserInput('');
    setIsLoading(true);

    const response = await evaluateAnswer(currentProblem, userMessage.text, hintCount);
    
    setMessages(prev => prev.slice(0, -1));

    if (response.includes('[CORRECT]')) {
      const cleanedResponse = response.replace('[CORRECT]', '').trim();
      const points = Math.max(0, 10 - hintCount * 3); // 10, 7, 4, 1...
      const successMessage = `${cleanedResponse}\n\n🎉 כל הכבוד! הוספת ${points} כוכבים לחשבונך.`;
      setMessages(prev => [...prev, { id: Date.now() + 2, sender: 'bot', text: successMessage }]);
      onSessionEnd(points, topic);
      setIsSolved(true);
    } else {
      setMessages(prev => [...prev, { id: Date.now() + 2, sender: 'bot', text: response }]);
      setHintCount(prev => prev + 1);
    }
    setIsLoading(false);
  };
  
  const handleRequestHint = async () => {
      if (isLoading || isSolved) return;

      setIsLoading(true);
      const thinkingMessage: ChatMessage = { id: Date.now(), sender: 'bot', text: '', isThinking: true };
      setMessages(prev => [...prev, thinkingMessage]);

      const hint = await getHint(currentProblem, hintCount);
      setMessages(prev => prev.slice(0, -1)); 

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: hint }]);
      setHintCount(prev => prev + 1);
      setIsLoading(false);
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitAnswer();
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitAnswer();
    }
  };


  return (
    <div className="flex flex-col h-full bg-white/70 backdrop-blur-sm rounded-2xl shadow-2xl shadow-sky-200/50">
      <header className="p-4 border-b border-sky-100 bg-sky-50/70 rounded-t-2xl flex justify-between items-center">
        <h2 className="text-xl font-bold text-sky-800">{topic} - {difficulty}</h2>
        <button onClick={onBack} className="text-sm bg-white hover:bg-slate-50 text-slate-600 font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-sm border border-slate-200">
          מסך הבית
        </button>
      </header>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <footer className="p-4 bg-sky-50/70 border-t border-sky-100 rounded-b-2xl">
        {isSolved ? (
            <div className="flex justify-center items-center gap-4">
                 <button onClick={startNewProblem} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-px transition duration-300">
                    תרגיל הבא
                </button>
                <button onClick={onBack} className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-px transition duration-300">
                    למסך הראשי
                </button>
            </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="flex items-start gap-3">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              placeholder="הקלד את תשובתך כאן..."
              rows={1}
              className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleRequestHint}
              disabled={isLoading}
              className="bg-amber-500 text-white font-bold py-3 px-5 rounded-lg hover:bg-amber-600 disabled:bg-amber-300 disabled:cursor-not-allowed transition duration-300 shadow-md hover:shadow-lg flex-shrink-0"
            >
              רמז
            </button>
            <button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-300 shadow-md hover:shadow-lg flex-shrink-0"
            >
              שלח
            </button>
          </form>
        )}
      </footer>
    </div>
  );
};

export default ChatView;