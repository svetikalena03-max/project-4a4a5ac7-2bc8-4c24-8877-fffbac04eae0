import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Theme = "light" | "dark";
export type Lang = "ru" | "en";

const THEME_KEY = "hg_theme";
const LANG_KEY = "hg_lang";

type Ctx = {
  theme: Theme;
  lang: Lang;
  setTheme: (t: Theme) => void;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const SettingsCtx = createContext<Ctx | null>(null);

const DICT: Record<Lang, Record<string, string>> = {
  ru: {
    home: "Главная", diary: "Дневник", health: "Здоровье", history: "История",
    charts: "Графики", profile: "Профиль", settings: "Настройки",
    habits: "Мои привычки", healthFeatures: "Особенности здоровья",
    weight: "Вес", water: "Вода", sleep: "Сон", pressure: "Давление",
    pulse: "Пульс", mood: "Настроение", energy: "Энергия",
    save: "Сохранить", back: "Назад", signIn: "Войти", signUp: "Зарегистрироваться",
    signOut: "Выйти",
    theme: "Тема", language: "Язык",
    light: "Светлая", dark: "Тёмная",
    appSettings: "Настройки приложения",
    appSettingsHint: "Тема, язык, отображение",
    settingsSaved: "Настройки сохранены",
  },
  en: {
    home: "Home", diary: "Diary", health: "Health", history: "History",
    charts: "Charts", profile: "Profile", settings: "Settings",
    habits: "My habits", healthFeatures: "Health features",
    weight: "Weight", water: "Water", sleep: "Sleep", pressure: "Blood pressure",
    pulse: "Pulse", mood: "Mood", energy: "Energy",
    save: "Save", back: "Back", signIn: "Sign in", signUp: "Sign up",
    signOut: "Sign out",
    theme: "Theme", language: "Language",
    light: "Light", dark: "Dark",
    appSettings: "App settings",
    appSettingsHint: "Theme, language, display",
    settingsSaved: "Settings saved",
  },
};

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function applyLang(lang: Lang) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lang;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [lang, setLangState] = useState<Lang>("ru");

  // initial load from localStorage
  useEffect(() => {
    const t = (localStorage.getItem(THEME_KEY) as Theme | null) ?? "light";
    const l = (localStorage.getItem(LANG_KEY) as Lang | null) ?? "ru";
    setThemeState(t);
    setLangState(l);
    applyTheme(t);
    applyLang(l);
  }, []);

  // sync from profile on auth
  useEffect(() => {
    const sync = async (uid: string | undefined) => {
      if (!uid) return;
      const { data } = await supabase.from("profiles").select("theme,language").eq("user_id", uid).maybeSingle();
      if (data?.theme === "light" || data?.theme === "dark") {
        setThemeState(data.theme);
        applyTheme(data.theme);
        localStorage.setItem(THEME_KEY, data.theme);
      }
      if (data?.language === "ru" || data?.language === "en") {
        setLangState(data.language);
        applyLang(data.language);
        localStorage.setItem(LANG_KEY, data.language);
      }
    };
    supabase.auth.getSession().then(({ data }) => sync(data.session?.user.id));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => sync(session?.user.id));
    return () => sub.subscription.unsubscribe();
  }, []);

  const persist = async (patch: { theme?: Theme; language?: Lang }) => {
    const { data } = await supabase.auth.getUser();
    const uid = data.user?.id;
    if (!uid) return;
    await supabase.from("profiles").update(patch).eq("user_id", uid);
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    applyTheme(t);
    localStorage.setItem(THEME_KEY, t);
    void persist({ theme: t });
  };

  const setLang = (l: Lang) => {
    setLangState(l);
    applyLang(l);
    localStorage.setItem(LANG_KEY, l);
    void persist({ language: l });
  };

  const t = (key: string) => DICT[lang][key] ?? DICT.ru[key] ?? key;

  return (
    <SettingsCtx.Provider value={{ theme, lang, setTheme, setLang, t }}>
      {children}
    </SettingsCtx.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsCtx);
  if (!ctx) {
    // fallback no-op (avoids crashes when used outside provider during SSR)
    return {
      theme: "light" as Theme,
      lang: "ru" as Lang,
      setTheme: () => {},
      setLang: () => {},
      t: (k: string) => DICT.ru[k] ?? k,
    };
  }
  return ctx;
}
