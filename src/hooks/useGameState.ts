import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, LEVEL_CONFIGS, Language } from '@/lib/types';
import { generateColorPair } from '@/lib/colors';
import { playCorrectSound, playWrongSound, playGameOverSound, playVictorySound } from '@/lib/audio';

const STORAGE_KEY = 'color-sense-test';

interface StoredData {
  bestRecord: number | null;
  language: Language;
  colorBlindMode: boolean;
}

export function useGameState() {
  const [language, setLanguage] = useState<Language>('zh-TW');
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 1,
    remainingLives: 3,
    totalTime: 0,
    isPlaying: false,
    isGameOver: false,
    isLevelComplete: false,
    isAllComplete: false,
    bestRecord: null,
    differentIndex: 0,
    baseColor: '#888888',
    differentColor: '#888888',
    showCorrectAnswer: false,
    colorBlindMode: false,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredData = JSON.parse(stored);
        setLanguage(data.language || 'zh-TW');
        setGameState((prev) => ({
          ...prev,
          bestRecord: data.bestRecord,
          colorBlindMode: data.colorBlindMode || false,
        }));
      }
    } catch (e) {
      console.log('Failed to load from localStorage');
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      const data: StoredData = {
        bestRecord: gameState.bestRecord,
        language,
        colorBlindMode: gameState.colorBlindMode,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.log('Failed to save to localStorage');
    }
  }, [gameState.bestRecord, language, gameState.colorBlindMode]);

  // Timer
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isGameOver && !gameState.isLevelComplete && !gameState.isAllComplete) {
      timerRef.current = setInterval(() => {
        setGameState((prev) => ({ ...prev, totalTime: prev.totalTime + 1 }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isGameOver, gameState.isLevelComplete, gameState.isAllComplete]);

  const generateLevel = useCallback((level: number) => {
    const config = LEVEL_CONFIGS[level - 1];
    const totalCells = config.gridCols * config.gridRows;
    const differentIndex = Math.floor(Math.random() * totalCells);
    const colors = generateColorPair(config.deltaE, level);

    setGameState((prev) => ({
      ...prev,
      currentLevel: level,
      differentIndex,
      baseColor: colors.base,
      differentColor: colors.different,
      isLevelComplete: false,
      showCorrectAnswer: false,
    }));
  }, []);

  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      currentLevel: 1,
      remainingLives: 3,
      totalTime: 0,
      isPlaying: true,
      isGameOver: false,
      isLevelComplete: false,
      isAllComplete: false,
      showCorrectAnswer: false,
    }));
    generateLevel(1);
  }, [generateLevel]);

  const handleCellClick = useCallback((index: number) => {
    if (gameState.isLevelComplete || gameState.isGameOver || gameState.isAllComplete) return;

    if (index === gameState.differentIndex) {
      // Correct!
      playCorrectSound();
      
      if (gameState.currentLevel >= 10) {
        // All complete!
        playVictorySound();
        const newBest = gameState.bestRecord === null || gameState.currentLevel > gameState.bestRecord
          ? gameState.currentLevel
          : gameState.bestRecord;
        setGameState((prev) => ({
          ...prev,
          isAllComplete: true,
          isPlaying: false,
          bestRecord: newBest,
        }));
      } else {
        setGameState((prev) => ({
          ...prev,
          isLevelComplete: true,
        }));
      }
    } else {
      // Wrong!
      playWrongSound();
      const newLives = gameState.remainingLives - 1;
      
      if (newLives <= 0) {
        // Game over
        playGameOverSound();
        const newBest = gameState.bestRecord === null || gameState.currentLevel - 1 > gameState.bestRecord
          ? gameState.currentLevel - 1
          : gameState.bestRecord;
        setGameState((prev) => ({
          ...prev,
          remainingLives: 0,
          isGameOver: true,
          isPlaying: false,
          showCorrectAnswer: true,
          bestRecord: newBest > 0 ? newBest : prev.bestRecord,
        }));
      } else {
        setGameState((prev) => ({
          ...prev,
          remainingLives: newLives,
        }));
      }
    }
  }, [gameState]);

  const nextLevel = useCallback(() => {
    const newLevel = gameState.currentLevel + 1;
    setGameState((prev) => ({
      ...prev,
      remainingLives: 3,
    }));
    generateLevel(newLevel);
  }, [gameState.currentLevel, generateLevel]);

  const resetGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      currentLevel: 1,
      remainingLives: 3,
      totalTime: 0,
      isPlaying: false,
      isGameOver: false,
      isLevelComplete: false,
      isAllComplete: false,
      showCorrectAnswer: false,
    }));
  }, []);

  const toggleColorBlindMode = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      colorBlindMode: !prev.colorBlindMode,
    }));
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'zh-TW' ? 'en' : 'zh-TW'));
  }, []);

  return {
    gameState,
    language,
    startGame,
    handleCellClick,
    nextLevel,
    resetGame,
    toggleColorBlindMode,
    toggleLanguage,
  };
}
