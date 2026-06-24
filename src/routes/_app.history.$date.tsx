import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useEntries, formatDateRu } from "@/lib/store";

export const Route = createFileRoute("/_app/history/$date")({
  component: HistoryDetail,
});

function HistoryDetail() {
  const { date } = Route.useParams();
  const { entries } = useEntries();
  const entry = entries.find((e) => e.date === date);

  return (
    <div className="flex flex-col gap-4">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link to="/history"><ArrowLeft className="mr-1 h-4 w-4" />История</Link>
      </Button>

      <PageHeader title={formatDateRu(date)} subtitle="Подробности дня" />

      {!entry ? (
        <Card className="p-6 text-center text-muted-foreground">Запись не найдена</Card>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Metric label="Вес" value={`${entry.weight.toFixed(1)} кг`} />
            <Metric label="Вода" value={`${(entry.water / 1000).toFixed(1)} л`} />
            <Metric label="Сон" value={`${entry.sleep.toFixed(1)} ч`} />
            <Metric label="Настроение" value={`${entry.mood}/10`} />
          </div>
          <Section title="Питание" body={entry.food} />
          <Section title="Напитки" body={entry.drinks} />
          <Section title="Самочувствие" body={entry.wellbeing} />
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold text-foreground">{value}</p>
    </Card>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{body || "—"}</p>
    </Card>
  );
}
