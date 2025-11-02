
import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types';
import { getLeaderboard } from '../utils/leaderboard';

interface LeaderboardScreenProps {
  onGoHome: () => void;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onGoHome }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setLeaderboard(getLeaderboard());
  }, []);

  return (
    <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-4xl font-bold text-cyan-400 mb-6 text-center">Leaderboard</h1>
      
      <div className="overflow-x-auto max-h-96">
        {leaderboard.length > 0 ? (
            <table className="w-full text-left">
            <thead className="border-b-2 border-slate-600 sticky top-0 bg-slate-800">
                <tr>
                <th className="p-3 text-lg font-semibold">Rank</th>
                <th className="p-3 text-lg font-semibold">Name</th>
                <th className="p-3 text-lg font-semibold text-right">Score</th>
                </tr>
            </thead>
            <tbody>
                {leaderboard.map((entry, index) => (
                <tr key={`${entry.name}-${index}`} className={`border-b border-slate-700 ${index < 3 ? 'text-cyan-300' : ''}`}>
                    <td className="p-3 text-xl font-bold">#{index + 1}</td>
                    <td className="p-3 font-medium">{entry.name}</td>
                    <td className="p-3 font-bold text-right">{entry.score}</td>
                </tr>
                ))}
            </tbody>
            </table>
        ) : (
            <p className="text-center text-slate-400 py-8">The leaderboard is empty. Be the first to set a score!</p>
        )}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onGoHome}
          className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-3 px-6 rounded-lg text-lg transition duration-300 transform hover:scale-105"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
