import React from 'react';
import type { Badge } from './types';
import { BadgeId, Topic, Difficulty } from './types';

const TrophyIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18.5 2h-13A2.5 2.5 0 0 0 3 4.5V10H2v4h1v5.5A2.5 2.5 0 0 0 5.5 22h13a2.5 2.5 0 0 0 2.5-2.5V14h1v-4h-1V4.5A2.5 2.5 0 0 0 18.5 2zM12 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/></svg>
);
const BrainIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-4-4 1.41-1.41L10 12.17l6.59-6.59L18 7l-8 8z"/></svg>
);
const MedalIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.17 13.4L12 13.47 8.83 15.4l.65-3.8-2.8-2.4 3.8-.34L12 5.5l1.52 3.36 3.8.34-2.8 2.4.65 3.8z"/></svg>
);
const CalendarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/></svg>
);


export const BADGES: Record<BadgeId, Badge> = {
  [BadgeId.DISTRIBUTIVE_CHAMP]: {
    id: BadgeId.DISTRIBUTIVE_CHAMP,
    name: "אלוף הפילוג",
    description: "5 תרגילים נכונים ברצף בנושא.",
    icon: <TrophyIcon className="h-8 w-8 text-yellow-400" />,
  },
  [BadgeId.EQUATION_MASTER]: {
    id: BadgeId.EQUATION_MASTER,
    name: "מאסטר המשוואות",
    description: "10 תרגילים נכונים בסך הכל בנושא פתרון משוואות.",
    icon: <BrainIcon className="h-8 w-8 text-blue-400" />,
  },
  [BadgeId.LEGALITY_KING]: {
    id: BadgeId.LEGALITY_KING,
    name: "מלך החוקיות",
    description: "פתרון 3 אתגרים יומיים רצופים.",
    icon: <MedalIcon className="h-8 w-8 text-red-400" />,
  },
  [BadgeId.PERSISTENT_GENIUS]: {
    id: BadgeId.PERSISTENT_GENIUS,
    name: "הגאון המתמיד",
    description: "15 ימי תרגול רצופים.",
    icon: <CalendarIcon className="h-8 w-8 text-green-400" />,
  },
};

export const TOPICS_CONFIG = [
  { id: Topic.ALGEBRAIC_EXPRESSIONS, name: Topic.ALGEBRAIC_EXPRESSIONS },
  { id: Topic.COMBINING_LIKE_TERMS, name: Topic.COMBINING_LIKE_TERMS },
  { id: Topic.SOLVING_EQUATIONS, name: Topic.SOLVING_EQUATIONS },
];

export const DIFFICULTIES_CONFIG = [
  { id: Difficulty.EASY, name: Difficulty.EASY },
  { id: Difficulty.MEDIUM, name: Difficulty.MEDIUM },
  { id: Difficulty.HARD, name: Difficulty.HARD },
];

export const SYSTEM_INSTRUCTION = `אתה "המאמן המתמטי", מאמן מתמטיקה וירטואלי, ידידותי, מכבד, ובלתי שיפוטי לכיתה ז'. גישתך היא "יחד נפתור את זה".
**חוקי יסוד:**
1.  **לעולם אל תספק תשובה סופית ישירות.** הנחה את התלמיד באמצעות שאלות פשוטות שמחלקות את הבעיה לשלבים.
2.  **הגישה היא סוקראטית.** שאל שאלות מנחות במקום לתת הוראות.
3.  **הדרגתיות ברמזים:** אם התלמיד טועה, ספק רמזים לפי הסדר הבא:
    *   **פעם ראשונה שטועה:** רמז עדין. (לדוגמה: "רעיון טוב! בדוק שוב את הסימנים," או "זכור את סדר פעולות החשבון.").
    *   **פעם שנייה שטועה:** רמז מפורט יותר. (לדוגמה: "כיוון נכון. מה דעתך לנסות להעביר את ה-7 לצד השני של המשוואה?").
    *   **פעם שלישית שטועה:** הנחיה לשלב הבא. (לדוגמה: "בוא נתמקד. השלב הראשון הוא לבודד את המשתנה x.").
4.  **משוב:** כל תגובה חייבת להתחיל במשוב חיובי ("כל הכבוד על הניסיון!", "אתה על הדרך הנכונה!", "התחלה מצוינת!"). לאחר מכן, הצבע על נקודת השיפור באופן עדין ומעודד. במקרה של תשובה שגויה, מצא בה אלמנט נכון ("אני רואה שהעברת את המספרים לצד הנכון, אבל שים לב מה קרה לסימן בדרך").
5.  **טון דיבור:** תמיד השתמש בטון ידידותי, מעודד ומכבד. אם התלמיד משתמש בשפה לא נאותה, הגב בנימוס והחזר את השיחה לנושא ("אני מבין שאתה מתוסכל, אבל בוא נתרכז בתרגיל ונעבור את זה יחד").
6.  **סיום תרגיל:** כשהתלמיד מגיע לתשובה הנכונה, אשר שהיא נכונה, שבח אותו, וספק הסבר קצר על הדרך הנכונה לפתרון. סיים את התשובה שלך תמיד עם המילה "[CORRECT]".
7.  **כתיב מתמטי:** השתמש תמיד בכתיב מתמטי ברור ותקין. לדוגמה, השתמש ב-'*' לכפל. כדי להדגיש משוואות וביטויים חשובים, עטוף אותם בשתי כוכביות, כך: **5x - 7 = 2x + 8**. אל תשתמש בסימני דולר ($).
`;