import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Share2 } from 'lucide-react';

interface ResultDialogProps {
  open: boolean;
  language: Language;
  level: number;
  isAllComplete: boolean;
  onRetry: () => void;
}

export const ResultDialog: React.FC<ResultDialogProps> = ({
  open,
  language,
  level,
  isAllComplete,
  onRetry,
}) => {
  const { t } = useTranslation(language);

  const handleShare = async () => {
    const reachedLevel = isAllComplete ? 10 : level - 1;
    const shareText = language === 'zh-TW'
      ? `🎨 色感大測試：我達到第 ${reachedLevel} 關！\n一般人達標第6關，你能超越嗎？`
      : `🎨 Color Sense Test: I reached level ${reachedLevel}!\nAverage is level 6, can you beat it?`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: t('title'),
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert(language === 'zh-TW' ? '已複製到剪貼簿！' : 'Copied to clipboard!');
      }
    } catch (e) {
      console.log('Share failed');
    }
  };

  const reachedLevel = isAllComplete ? 10 : level - 1;
  const isBelowAverage = reachedLevel < 6;

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">
                {isAllComplete ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="block"
                  >
                    🎉 {t('allComplete')}
                  </motion.span>
                ) : (
                  <span>{t('gameOver')}</span>
                )}
              </DialogTitle>
              <DialogDescription className="text-center space-y-4 pt-4">
                <motion.p 
                  className="text-xl font-bold text-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {t('yourScore', { level: reachedLevel })}
                </motion.p>
                
                <motion.p
                  className="text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {t('averageReach')}
                </motion.p>

                {isBelowAverage && (
                  <motion.div
                    className="text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950 p-4 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <span className="text-5xl block mb-2">⚠️</span>
                    <p>{t('belowAverage')}</p>
                  </motion.div>
                )}

                {isAllComplete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl py-4"
                  >
                    🏆✨🎊
                  </motion.div>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 mt-4">
              <Button onClick={handleShare} variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                {t('shareResult')}
              </Button>
              <Button onClick={onRetry} className="w-full">
                {t('retry')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
