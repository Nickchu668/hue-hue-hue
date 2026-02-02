import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RefreshCw } from 'lucide-react';

interface GameHeaderProps {
  level: number;
  totalTime: number;
  remainingLives: number;
  bestRecord: number | null;
  language: Language;
  colorBlindMode: boolean;
  onReset: () => void;
  onToggleLanguage: () => void;
  onToggleColorBlindMode: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  level,
  totalTime,
  remainingLives,
  bestRecord,
  language,
  colorBlindMode,
  onReset,
  onToggleLanguage,
  onToggleColorBlindMode,
}) => {
  const { t } = useTranslation(language);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 space-y-4">
      {/* Title and Language Toggle */}
      <div className="flex items-center justify-between">
        <motion.h1 
          className="text-2xl md:text-3xl font-bold text-foreground"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t('title')}
        </motion.h1>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleLanguage}
          className="text-lg"
        >
          {language === 'zh-TW' ? '🇹🇼' : '🇺🇸'}
        </Button>
      </div>

      {/* Stats Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base">
        <div className="flex items-center gap-4">
          <span className="font-medium">
            {t('level')}: <span className="text-primary font-bold">{level}/10</span>
          </span>
          <span className="font-medium">
            {t('time')}: <span className="text-primary font-bold">{formatTime(totalTime)}</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="font-medium">
            {t('lives')}: 
            <span className="ml-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: i < remainingLives ? 1 : 0.5,
                    opacity: i < remainingLives ? 1 : 0.3,
                  }}
                  className="inline-block"
                >
                  ❤️
                </motion.span>
              ))}
            </span>
          </span>
          <span className="font-medium text-muted-foreground">
            {t('bestRecord')}: {bestRecord !== null ? bestRecord : t('noBest')}
          </span>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Switch
            checked={colorBlindMode}
            onCheckedChange={onToggleColorBlindMode}
            id="colorblind-mode"
          />
          <label htmlFor="colorblind-mode" className="text-sm cursor-pointer">
            {t('colorBlindMode')}
          </label>
        </div>
        <Button variant="outline" size="sm" onClick={onReset}>
          <RefreshCw className="w-4 h-4 mr-1" />
          {t('reset')}
        </Button>
      </div>
    </div>
  );
};
