
export enum Topic {
  ALGEBRAIC_EXPRESSIONS = "ביטויים אלגבריים (כתיבה)",
  COMBINING_LIKE_TERMS = "כינוס איברים דומים",
  SOLVING_EQUATIONS = "פתרון משוואות בנעלם אחד",
}

export enum Difficulty {
  EASY = "קל",
  MEDIUM = "בינוני",
  HARD = "קשה",
}

export enum BadgeId {
  DISTRIBUTIVE_CHAMP = "אלוף הפילוג",
  EQUATION_MASTER = "מאסטר המשוואות",
  LEGALITY_KING = "מלך החוקיות",
  PERSISTENT_GENIUS = "הגאון המתמיד",
}

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export interface UserData {
  score: number;
  badges: BadgeId[];
  // Mock data for badge logic
  solvedProblems: Record<Topic, number>;
  dailyChallenges: number;
  consecutiveDays: number;
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  isThinking?: boolean;
}
