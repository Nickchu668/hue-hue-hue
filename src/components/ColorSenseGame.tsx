import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/hooks/useGameState';
import { useTranslation } from '@/lib/i18n';
import { ColorGrid } from '@/components/ColorGrid';
import { GameHeader } from '@/components/GameHeader';
import { ResultDialog } from '@/components/ResultDialog';
import { LevelCompleteOverlay } from '@/components/LevelCompleteOverlay';
import { StartScreen } from '@/components/StartScreen';

const ColorSenseGame: React.FC = () => {
  const {
    gameState,
    language,
    startGame,
    handleCellClick,
    nextLevel,
    resetGame,
    toggleColorBlindMode,
    toggleLanguage,
  } = useGameState();

  const { t } = useTranslation(language);

  // Show start screen if not playing
  if (!gameState.isPlaying && !gameState.isGameOver && !gameState.isAllComplete) {
    return (
      <StartScreen
        language={language}
        bestRecord={gameState.bestRecord}
        onStart={startGame}
        onToggleLanguage={toggleLanguage}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <GameHeader
        level={gameState.currentLevel}
        totalTime={gameState.totalTime}
        remainingLives={gameState.remainingLives}
        bestRecord={gameState.bestRecord}
        language={language}
        colorBlindMode={gameState.colorBlindMode}
        onReset={resetGame}
        onToggleLanguage={toggleLanguage}
        onToggleColorBlindMode={toggleColorBlindMode}
      />

      {/* Main Game Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          key={gameState.currentLevel}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-center text-muted-foreground mb-4">
            {t('clickDifferent')}
          </p>
          <ColorGrid
            level={gameState.currentLevel}
            baseColor={gameState.baseColor}
            differentColor={gameState.differentColor}
            differentIndex={gameState.differentIndex}
            onCellClick={handleCellClick}
            showCorrectAnswer={gameState.showCorrectAnswer}
            colorBlindMode={gameState.colorBlindMode}
            disabled={gameState.isLevelComplete || gameState.isGameOver}
          />
        </motion.div>
      </div>

      {/* Wrong click feedback */}
      <AnimatePresence>
        {gameState.remainingLives < 3 && !gameState.isGameOver && (
          <motion.div
            key={`lives-${gameState.remainingLives}`}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            initial={{ opacity: 1, scale: 1.5 }}
            animate={{ opacity: 0, scale: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-6xl text-red-500">❌</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Complete Overlay */}
      <LevelCompleteOverlay
        show={gameState.isLevelComplete}
        language={language}
        onNextLevel={nextLevel}
      />

      {/* Result Dialog */}
      <ResultDialog
        open={gameState.showGameOverDialog || gameState.isAllComplete}
        language={language}
        level={gameState.currentLevel}
        isAllComplete={gameState.isAllComplete}
        onRetry={startGame}
      />
    </div>
  );
};

export default ColorSenseGame;
