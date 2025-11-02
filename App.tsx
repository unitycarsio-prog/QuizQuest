
import React, { useState, useCallback } from 'react';
import { GameState, Question, QuizSettings } from './types';
import HomeScreen from './components/HomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import { generateQuizQuestions } from './services/geminiService';
import { addScoreToLeaderboard } from './utils/leaderboard';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.HOME);
  const [quizSettings, setQuizSettings] = useState<QuizSettings | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState<number>(0);
  const [nickname, setNickname] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartQuiz = useCallback(async (settings: QuizSettings) => {
    setIsLoading(true);
    setError(null);
    try {
      setNickname(settings.nickname);
      const fetchedQuestions = await generateQuizQuestions(settings.grade, settings.subject);
      if (fetchedQuestions.length === 0) {
        throw new Error("The AI failed to generate questions. Please try different options.");
      }
      setQuestions(fetchedQuestions);
      setQuizSettings(settings);
      setScore(0);
      setGameState(GameState.QUIZ);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      setGameState(GameState.HOME);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFinishQuiz = useCallback((finalScore: number) => {
    setScore(finalScore);
    if (nickname && finalScore > 0) {
      addScoreToLeaderboard({ name: nickname, score: finalScore });
    }
    setGameState(GameState.RESULTS);
  }, [nickname]);

  const handlePlayAgain = useCallback(() => {
    setGameState(GameState.HOME);
    setQuestions([]);
    setQuizSettings(null);
  }, []);

  const handleViewLeaderboard = useCallback(() => {
    setGameState(GameState.LEADERBOARD);
  }, []);
  
  const handleGoHome = useCallback(() => {
    setGameState(GameState.HOME);
  }, []);


  const renderScreen = () => {
    switch (gameState) {
      case GameState.QUIZ:
        return <QuizScreen questions={questions} onFinishQuiz={handleFinishQuiz} />;
      case GameState.RESULTS:
        return <ResultsScreen score={score} nickname={nickname} onPlayAgain={handlePlayAgain} onViewLeaderboard={handleViewLeaderboard} />;
      case GameState.LEADERBOARD:
        return <LeaderboardScreen onGoHome={handleGoHome} />;
      case GameState.HOME:
      default:
        return <HomeScreen onStartQuiz={handleStartQuiz} onViewLeaderboard={handleViewLeaderboard} isLoading={isLoading} error={error} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;
