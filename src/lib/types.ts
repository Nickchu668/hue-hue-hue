export type Language = 'zh-TW' | 'en';

export interface LevelConfig {
  level: number;
  gridCols: number;
  gridRows: number;
  cellSize: number;
  deltaE: number;
}

export interface GameState {
  currentLevel: number;
  remainingLives: number;
  totalTime: number;
  isPlaying: boolean;
  isGameOver: boolean;
  isLevelComplete: boolean;
  isAllComplete: boolean;
  bestRecord: number | null;
  differentIndex: number;
  baseColor: string;
  differentColor: string;
  showCorrectAnswer: boolean;
  showGameOverDialog: boolean;
  colorBlindMode: boolean;
}

export interface Translations {
  title: string;
  level: string;
  time: string;
  lives: string;
  bestRecord: string;
  noBest: string;
  reset: string;
  nextLevel: string;
  retry: string;
  levelComplete: string;
  gameOver: string;
  allComplete: string;
  congratulations: string;
  yourScore: string;
  averageReach: string;
  belowAverage: string;
  shareResult: string;
  startGame: string;
  colorBlindMode: string;
  correctAnswer: string;
  clickDifferent: string;
  wrongClick: string;
  livesRemaining: string;
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, gridCols: 3, gridRows: 3, cellSize: 120, deltaE: 8 },
  { level: 2, gridCols: 3, gridRows: 3, cellSize: 110, deltaE: 7 },
  { level: 3, gridCols: 3, gridRows: 3, cellSize: 100, deltaE: 6 },
  { level: 4, gridCols: 4, gridRows: 4, cellSize: 90, deltaE: 5 },
  { level: 5, gridCols: 4, gridRows: 4, cellSize: 80, deltaE: 4 },
  { level: 6, gridCols: 5, gridRows: 5, cellSize: 70, deltaE: 3.5 },
  { level: 7, gridCols: 5, gridRows: 5, cellSize: 65, deltaE: 3 },
  { level: 8, gridCols: 5, gridRows: 5, cellSize: 60, deltaE: 2.5 },
  { level: 9, gridCols: 5, gridRows: 6, cellSize: 55, deltaE: 0.8 },
  { level: 10, gridCols: 5, gridRows: 6, cellSize: 50, deltaE: 0.5 },
];

export const BACKUP_COLOR_PAIRS = [
  ['#C8C8C8', '#C0C8C8'],
  ['#646464', '#646364'],
  ['#0096C8', '#0095C8'],
  ['#FFC8C8', '#FFC7C8'],
  ['#64C864', '#64C964'],
  ['#9696FF', '#9695FF'],
];
