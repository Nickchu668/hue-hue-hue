import React from 'react';
import { motion } from 'framer-motion';
import { LEVEL_CONFIGS } from '@/lib/types';
import { getPattern } from '@/lib/colors';

interface ColorGridProps {
  level: number;
  baseColor: string;
  differentColor: string;
  differentIndex: number;
  onCellClick: (index: number) => void;
  showCorrectAnswer: boolean;
  colorBlindMode: boolean;
  disabled: boolean;
}

export const ColorGrid: React.FC<ColorGridProps> = ({
  level,
  baseColor,
  differentColor,
  differentIndex,
  onCellClick,
  showCorrectAnswer,
  colorBlindMode,
  disabled,
}) => {
  const config = LEVEL_CONFIGS[level - 1];
  const totalCells = config.gridCols * config.gridRows;

  return (
    <div
      className="grid gap-2 mx-auto"
      style={{
        gridTemplateColumns: `repeat(${config.gridCols}, ${config.cellSize}px)`,
        gridTemplateRows: `repeat(${config.gridRows}, ${config.cellSize}px)`,
      }}
    >
      {Array.from({ length: totalCells }).map((_, index) => {
        const isDifferent = index === differentIndex;
        const cellColor = isDifferent ? differentColor : baseColor;
        const pattern = colorBlindMode && isDifferent ? getPattern(level) : undefined;

        return (
          <motion.button
            key={index}
            className="rounded-lg shadow-lg transition-transform focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed relative overflow-hidden"
            style={{
              backgroundColor: cellColor,
              width: config.cellSize,
              height: config.cellSize,
              backgroundImage: pattern,
            }}
            whileHover={disabled ? {} : { scale: 1.05 }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            onClick={() => !disabled && onCellClick(index)}
            disabled={disabled}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              boxShadow: showCorrectAnswer && isDifferent 
                ? '0 0 20px 5px rgba(34, 197, 94, 0.8)' 
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.02,
              boxShadow: showCorrectAnswer && isDifferent 
                ? { repeat: Infinity, repeatType: 'reverse', duration: 0.5 }
                : {}
            }}
          >
            {showCorrectAnswer && isDifferent && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="text-3xl"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  ⬇️
                </motion.div>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
