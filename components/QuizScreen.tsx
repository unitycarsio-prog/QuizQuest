import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';
import { useSound } from '../hooks/useSound';
import { QUESTION_TIME_LIMIT } from '../constants';

interface QuizScreenProps {
  questions: Question[];
  onFinishQuiz: (finalScore: number) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onFinishQuiz }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { playCorrect, playIncorrect } = useSound();
  // Fix: In a browser environment, `setInterval` returns a `number`, not `NodeJS.Timeout`.
  const timerRef = useRef<number | null>(null);
  const question = questions[currentQuestionIndex];

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(QUESTION_TIME_LIMIT);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      resetTimer();
    } else {
      onFinishQuiz(score);
    }
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsAnswered(true); // Timeout is like an incorrect answer
          setTimeout(handleNextQuestion, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestionIndex]);

  const handleAnswer = (option: string) => {
    if (isAnswered) return;

    if (timerRef.current) clearInterval(timerRef.current);
    
    setIsAnswered(true);
    setSelectedOption(option);
    
    if (option === question.answer) {
      const points = 2 + timeLeft; // Scoring logic
      setScore(prev => prev + points);
      playCorrect();
    } else {
      playIncorrect();
    }

    setTimeout(handleNextQuestion, 1500);
  };

  const getOptionClass = (option: string) => {
    if (!isAnswered) {
      return 'bg-slate-700 hover:bg-slate-600';
    }
    if (option === question.answer) {
      return 'bg-green-500/80';
    }
    if (option === selectedOption && option !== question.answer) {
      return 'bg-red-500/80';
    }
    return 'bg-slate-700 opacity-50';
  };

  return (
    <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-semibold">Question {currentQuestionIndex + 1}/{questions.length}</div>
        <div className="text-2xl font-bold text-cyan-400">Score: {score}</div>
      </div>

      <div className="relative w-full bg-slate-700 rounded-full h-4 mb-6">
        <div 
          className="absolute top-0 left-0 h-full bg-cyan-500 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${(timeLeft / QUESTION_TIME_LIMIT) * 100}%` }}
        ></div>
        <span className="absolute w-full text-center text-xs font-bold text-white">{timeLeft}s</span>
      </div>

      <div className="bg-slate-900/50 p-6 rounded-lg mb-6 min-h-[100px] flex items-center justify-center">
        <h2 className="text-xl md:text-2xl font-medium text-center" dangerouslySetInnerHTML={{ __html: question.question }}></h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            disabled={isAnswered}
            className={`w-full p-4 rounded-lg text-lg text-left font-semibold transition-all duration-300 transform ${getOptionClass(option)} ${!isAnswered ? 'hover:scale-105' : 'cursor-not-allowed'}`}
            dangerouslySetInnerHTML={{ __html: option }}
          >
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizScreen;