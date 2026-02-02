import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

interface LevelCompleteOverlayProps {
  show: boolean;
  language: Language;
  onNextLevel: () => void;
}

// Firework particle component
const Firework: React.FC<{ delay: number; x: number; y: number }> = ({ delay, x, y }) => {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const distance = 100 + Math.random() * 50;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{ backgroundColor: color, left: x, top: y }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 0.8,
              delay: delay,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </>
  );
};

export const LevelCompleteOverlay: React.FC<LevelCompleteOverlayProps> = ({
  show,
  language,
  onNextLevel,
}) => {
  const { t } = useTranslation(language);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Fireworks */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Firework delay={0} x={100} y={200} />
            <Firework delay={0.2} x={300} y={150} />
            <Firework delay={0.4} x={200} y={300} />
            <Firework delay={0.1} x={350} y={250} />
            <Firework delay={0.3} x={150} y={350} />
          </div>

          <motion.div
            className="text-center space-y-6"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <motion.h2
              className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg"
              animate={{ 
                scale: [1, 1.1, 1],
                textShadow: [
                  '0 0 20px rgba(34, 197, 94, 0.8)',
                  '0 0 40px rgba(34, 197, 94, 1)',
                  '0 0 20px rgba(34, 197, 94, 0.8)',
                ],
              }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              ✨ {t('levelComplete')} ✨
            </motion.h2>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                size="lg"
                onClick={onNextLevel}
                className="text-xl px-8 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                {t('nextLevel')} →
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
