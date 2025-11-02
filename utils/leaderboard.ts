
import { LeaderboardEntry } from '../types';

const LEADERBOARD_KEY = 'quizquest_leaderboard';
const NICKNAME_KEY = 'quizquest_nickname';

/**
 * Retrieves the leaderboard from local storage and sorts it by score.
 */
export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const leaderboardJSON = localStorage.getItem(LEADERBOARD_KEY);
    if (!leaderboardJSON) {
      return [];
    }
    const leaderboard: LeaderboardEntry[] = JSON.parse(leaderboardJSON);
    return leaderboard.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error("Failed to parse leaderboard from localStorage", error);
    return [];
  }
};

/**
 * Adds a new score to the leaderboard in local storage.
 */
export const addScoreToLeaderboard = (newEntry: LeaderboardEntry): void => {
  try {
    const leaderboard = getLeaderboard();
    leaderboard.push(newEntry);
    // Sort and keep top 100 or some limit if you want
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
  } catch (error) {
    console.error("Failed to save score to leaderboard", error);
  }
};

/**
 * Retrieves the user's nickname from local storage.
 */
export const getNickname = (): string | null => {
  return localStorage.getItem(NICKNAME_KEY);
};

/**
 * Saves the user's nickname to local storage.
 */
export const setNickname = (nickname: string): void => {
  localStorage.setItem(NICKNAME_KEY, nickname);
};
