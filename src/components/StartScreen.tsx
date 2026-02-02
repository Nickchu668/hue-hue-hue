import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StartScreenProps {
  language: Language;
  bestRecord: number | null;
  onStart: () => void;
  onToggleLanguage: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  language,
  bestRecord,
  onStart,
  onToggleLanguage,
}) => {
  const { t } = useTranslation(language);

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-end mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleLanguage}
              className="text-lg"
            >
              {language === 'zh-TW' ? '🇹🇼' : '🇺🇸'}
            </Button>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
          >
            <CardTitle className="text-3xl md:text-4xl font-bold">
              🎨 {t('title')}
            </CardTitle>
          </motion.div>
          <CardDescription className="text-base mt-4">
            {t('clickDifferent')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Demo grid */}
          <motion.div
            className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-14 h-14 rounded-lg shadow-md"
                style={{
                  backgroundColor: i === 4 ? '#6B8E6B' : '#6B8E7B',
                }}
                animate={i === 4 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            ))}
          </motion.div>

          {bestRecord !== null && (
            <motion.p
              className="text-center text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {t('bestRecord')}: {bestRecord}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              size="lg"
              className="w-full text-xl py-6"
              onClick={onStart}
            >
              {t('startGame')} 🚀
            </Button>
          </motion.div>

          <motion.p
            className="text-xs text-center text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {t('averageReach')}
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
