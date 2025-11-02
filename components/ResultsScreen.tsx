
import React from 'react';

interface ResultsScreenProps {
  score: number;
  nickname: string;
  onPlayAgain: () => void;
  onViewLeaderboard: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, nickname, onPlayAgain, onViewLeaderboard }) => {
  return (
    <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl text-center animate-fade-in-down w-full max-w-lg mx-auto">
      <h1 className="text-4xl font-bold text-cyan-400 mb-4">Quiz Complete!</h1>
      <p className="text-slate-300 text-xl mb-2">Congratulations, {nickname}!</p>
      <p className="text-slate-300 text-xl mb-2">Your final score is:</p>
      <p className="text-7xl font-bold text-white mb-8 animate-pulse">{score}</p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onPlayAgain}
          className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-3 px-6 rounded-lg text-lg transition duration-300 transform hover:scale-105"
        >
          Play Again
        </button>
        <button
          onClick={onViewLeaderboard}
          className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-cyan-400 font-bold py-3 px-6 rounded-lg text-lg transition duration-300 transform hover:scale-105"
        >
          View Leaderboard
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
