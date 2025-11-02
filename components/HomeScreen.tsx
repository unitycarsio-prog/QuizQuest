
import React, { useState, useEffect } from 'react';
import { QuizSettings } from '../types';
import { GRADES, SUBJECTS } from '../constants';
import { getNickname, setNickname as saveNickname } from '../utils/leaderboard';

interface HomeScreenProps {
  onStartQuiz: (settings: QuizSettings) => void;
  onViewLeaderboard: () => void;
  isLoading: boolean;
  error: string | null;
}

const loadingMessages = [
  "Consulting the AI professor...",
  "Crafting challenging questions...",
  "Shuffling the options...",
  "Warming up the thinking circuits...",
  "Almost ready to test your knowledge!",
];

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartQuiz, onViewLeaderboard, isLoading, error }) => {
  const [nickname, setNickname] = useState<string>('');
  const [grade, setGrade] = useState<string>(GRADES[0]);
  const [subject, setSubject] = useState<string>(SUBJECTS[0]);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const savedNickname = getNickname();
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    if (isLoading) {
      let index = 0;
      interval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[index]);
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
        setFormError("Please enter a nickname to play.");
        return;
    }
    setFormError(null);
    saveNickname(nickname.trim());
    onStartQuiz({ nickname: nickname.trim(), grade, subject });
  };

  return (
    <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl text-center animate-fade-in-down w-full max-w-lg mx-auto">
      <h1 className="text-5xl font-bold text-cyan-400 mb-2">QuizQuest AI</h1>
      <p className="text-slate-300 mb-8">Test your knowledge with AI-generated quizzes!</p>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-6 text-sm" role="alert">
          <strong>Oops!</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nickname-input" className="block text-lg font-semibold text-slate-300 mb-2 text-left">
            Enter Your Nickname
          </label>
          <input
            id="nickname-input"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="e.g., CosmicCoder"
            disabled={isLoading}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
            maxLength={20}
          />
           {formError && <p className="text-red-400 text-sm mt-2 text-left">{formError}</p>}
        </div>

        <div>
          <label htmlFor="grade-select" className="block text-lg font-semibold text-slate-300 mb-2 text-left">
            Select Your Grade
          </label>
          <select
            id="grade-select"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            disabled={isLoading}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          >
            {GRADES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="subject-select" className="block text-lg font-semibold text-slate-300 mb-2 text-left">
            Select Your Subject
          </label>
          <select
            id="subject-select"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={isLoading}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg transition duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center min-h-[56px]"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{loadingMessage}</span>
            </>
          ) : (
            'Start Quiz'
          )}
        </button>
      </form>
      
      <div className="mt-6">
        <button
          onClick={onViewLeaderboard}
          disabled={isLoading}
          className="w-full bg-slate-700 hover:bg-slate-600 text-cyan-400 font-bold py-3 px-4 rounded-lg text-lg transition duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed disabled:scale-100"
        >
          View Leaderboard
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;
