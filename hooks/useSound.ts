import { useCallback } from 'react';

export const useSound = () => {
  const playCorrect = useCallback(() => {
    // Sound has been removed.
  }, []);

  const playIncorrect = useCallback(() => {
    // Sound has been removed.
  }, []);

  return { playCorrect, playIncorrect };
};
