import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { analyzeMeal, type AnalyzeMealResult } from "@/lib/ai.functions";
import { ArrowLeft, Brain } from "lucide-react";

const TEST_MEAL_DATA = {
  foodText: "Овсянка с бананом, кофе без сахара",
  age: 35,
  height: 170,
  weight: 72,
  goal: "Похудение",
  diseases: "Гипертония",
};

export const Route = createFileRoute("/_app/ai")({
  component: AiPage,
});

function AiPage() {
  const analyzeMealFn = useServerFn(analyzeMeal);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeMealResult | null>(null);

  const runTest = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await analyzeMealFn({ data: TEST_MEAL_DATA });
      setResult(response);
    } catch (error) {
      setResult({
        ok: false,
        error: error instanceof Error ? error.message : "Не удалось выполнить AI-анализ",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Link to="/profile" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Назад
      </Link>
      <h1 className="text-2xl font-bold text-foreground">AI-рекомендации</h1>
      <Card className="flex flex-col items-center gap-3 p-6 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Brain className="h-6 w-6" />
        </span>
        <p className="text-base font-semibold text-foreground">Скоро</p>
        <p className="text-sm text-muted-foreground">
          Персональные AI-рекомендации по питанию, сну и активности появятся в следующих версиях.
        </p>
        <Button type="button" onClick={runTest} disabled={loading}>
          {loading ? "Анализ..." : "Тест AI"}
        </Button>
      </Card>

      {result && !result.ok && (
        <Alert variant="destructive">
          <AlertTitle>AI недоступен</AlertTitle>
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      )}

      {result?.ok && (
        <Card className="flex flex-col gap-3 p-6 text-left">
          <p className="text-base font-semibold text-foreground">Результат анализа</p>
          <p className="text-sm text-foreground">{result.summary}</p>
          {result.recommendations.length > 0 && (
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {result.recommendations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  );
}
