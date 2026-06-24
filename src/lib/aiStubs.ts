// Заглушки будущих AI-модулей. Единая точка интеграции с Lovable AI Gateway.
// После подключения Supabase сюда же подключим серверные функции и кеширование.

import type { DayEntry, Meal, Profile } from "./store";

export interface MealAnalysis {
  mealId: string;
  type: Meal["type"];
  time?: string;
  summary: string;
  recommendations: string[];
}

export interface DrinksAnalysis {
  totalWaterMl: number;
  totalCaffeineMl: number;
  totalSweetMl: number;
  notes: string[];
}

export interface DayAnalysis {
  summary: string;
  meals: MealAnalysis[];
  drinks: DrinksAnalysis;
  recommendations: string[];
}

export async function analyzeMeal(meal: Meal, _profile: Profile | null): Promise<MealAnalysis> {
  return {
    mealId: meal.id,
    type: meal.type,
    time: meal.time,
    summary: "AI-анализ приёма пищи появится после подключения языковой модели.",
    recommendations: [],
  };
}

export async function analyzeDay(entry: DayEntry, _profile: Profile | null): Promise<DayAnalysis> {
  return {
    summary: "AI-анализ появится после подключения языковой модели.",
    meals: [],
    drinks: {
      totalWaterMl: entry.water ?? 0,
      totalCaffeineMl: entry.coffee ?? 0,
      totalSweetMl: (entry.soda ?? 0) + (entry.juice ?? 0),
      notes: [],
    },
    recommendations: [
      "Сохраняйте записи в дневнике каждый день.",
      "Следите за давлением и пульсом.",
      "Старайтесь спать не менее 7 часов.",
    ],
  };
}

export async function suggestMenuForTomorrow(_profile: Profile | null): Promise<string[]> {
  return [];
}

export async function transcribeVoice(_audio: Blob): Promise<string> {
  return "";
}
