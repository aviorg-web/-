import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
// FIX: Changed from type-only import to a value import as enums are used in template strings.
import { Topic, Difficulty } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateExplanation(topic: Topic, difficulty: Difficulty): Promise<string> {
    const prompt = `ספק הסבר פשוט לתלמיד כיתה ז' בנושא: "${topic}" ברמת קושי "${difficulty}".
לאחר ההסבר, הצג דוגמה.
עבור הדוגמה, הצג פתרון מלא ושלם, שלב אחר שלב, עם הסבר מפורט לכל שלב בדרך.
ההסבר והפתרון צריכים להיות ברורים ומותאמים לתלמיד כיתה ז'.
השתמש בכתיב מתמטי תקין וברור.
אל תוסיף שום טקסט מקדים או מסכם מעבר להסבר ולדוגמה. התחל ישר עם ההסבר.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.3,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating explanation:", error);
        return "אירעה שגיאה בניסיון להציג את ההסבר. נסה שוב מאוחר יותר.";
    }
}

export async function generateProblem(topic: Topic, difficulty: Difficulty, history: string[] = []): Promise<string> {
    let prompt = `צור עבורי תרגיל במתמטיקה לתלמיד כיתה ז'.
נושא: ${topic}.
רמת קושי: ${difficulty}.
הצג רק את התרגיל עצמו, ללא הקדמות או הסברים.`;

    if (history.length > 0) {
        prompt += `\n\nחשוב מאוד: זהו תרגול מתמשך. אל תחזור על התרגילים הבאים שכבר הוצגו למשתמש בסבב הנוכחי:\n- ${history.join('\n- ')}`;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating problem:", error);
        return "אירעה שגיאה בניסיון ליצור תרגיל. נסה שוב מאוחר יותר.";
    }
}

export async function evaluateAnswer(problem: string, answer: string, hintCount: number): Promise<string> {
    const prompt = `התרגיל הוא: "${problem}".
התשובה של התלמיד היא: "${answer}".
התלמיד ביקש ${hintCount} רמזים עד כה.
הערך את התשובה שלו ופעל לפי כללי היסוד שלך כמאמן. אם התשובה נכונה, סיים את תגובתך במילה "[CORRECT]".`;

    try {
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                 temperature: 0.5,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error evaluating answer:", error);
        return "אירעה שגיאה בניתוח התשובה. נסה שוב.";
    }
}

export async function getHint(problem: string, hintCount: number): Promise<string> {
    const prompt = `התרגיל הוא: "${problem}".
התלמיד ביקש רמז. זהו הרמז ה-${hintCount + 1} שהוא מקבל.
ספק רמז סוקראטי (שאלה מנחה) שעוזר לו להתקדם לשלב הבא, מבלי לתת את התשובה או את דרך הפתרון ישירות.
שמור על טון של מאמן ועקוב אחר כללי היסוד שלך.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.6,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating hint:", error);
        return "אירעה שגיאה בניסיון לספק רמז. נסה לשוב.";
    }
}
