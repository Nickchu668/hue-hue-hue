import { Language, Translations } from './types';

export const translations: Record<Language, Translations> = {
  'zh-TW': {
    title: '色感大測試',
    level: '關卡',
    time: '時間',
    lives: '生命',
    bestRecord: '最佳紀錄',
    noBest: '無',
    reset: '重置',
    nextLevel: '下一關',
    retry: '重試',
    levelComplete: '過關！',
    gameOver: '遊戲結束',
    allComplete: '全部通關！',
    congratulations: '恭喜你！',
    yourScore: '你達到第 {level} 關',
    averageReach: '~80%以上玩家可以完成第6關',
    belowAverage: '閣下色感判斷比較弱，建議給眼科醫生作檢查',
    shareResult: '分享結果',
    startGame: '開始遊戲',
    colorBlindMode: '色盲輔助模式',
    correctAnswer: '正確答案！',
    clickDifferent: '點擊顏色不同的方格',
    wrongClick: '點錯了！',
    livesRemaining: '剩餘 {lives} 次機會',
  },
  'en': {
    title: 'Color Sense Test',
    level: 'Level',
    time: 'Time',
    lives: 'Lives',
    bestRecord: 'Best',
    noBest: 'None',
    reset: 'Reset',
    nextLevel: 'Next Level',
    retry: 'Retry',
    levelComplete: 'Level Complete!',
    gameOver: 'Game Over',
    allComplete: 'All Complete!',
    congratulations: 'Congratulations!',
    yourScore: 'You reached level {level}',
    averageReach: '~80% of players can complete level 6',
    belowAverage: 'Your color perception seems weaker, consider consulting an eye doctor',
    shareResult: 'Share Result',
    startGame: 'Start Game',
    colorBlindMode: 'Color Blind Mode',
    correctAnswer: 'Correct Answer!',
    clickDifferent: 'Click the different colored tile',
    wrongClick: 'Wrong!',
    livesRemaining: '{lives} lives remaining',
  },
};

export const useTranslation = (lang: Language) => {
  const t = (key: keyof Translations, params?: Record<string, string | number>) => {
    let text = translations[lang][key];
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };
  return { t };
};
