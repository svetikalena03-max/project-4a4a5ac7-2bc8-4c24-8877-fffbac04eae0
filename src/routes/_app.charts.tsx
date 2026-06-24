import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { useEntries, formatDateShort } from "@/lib/store";

export const Route = createFileRoute("/_app/charts")({
  component: ChartsPage,
});

function ChartsPage() {
  const { entries } = useEntries();
  const data = entries.map((e) => ({
    date: formatDateShort(e.date),
    weight: e.weight,
    water: +(e.water / 1000).toFixed(2),
    sleep: e.sleep,
  }));

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Графики" subtitle="Динамика по дням" />

      <ChartCard title="Вес, кг" color="var(--chart-1)">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
          <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" domain={["dataMin - 0.5", "dataMax + 0.5"]} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
          <Line type="monotone" dataKey="weight" stroke="var(--chart-1)" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ChartCard>

      <ChartCard title="Вода, л" color="var(--chart-2)">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
          <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
          <Bar dataKey="water" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ChartCard>

      <ChartCard title="Сон, часов" color="var(--chart-5)">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
          <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
          <Line type="monotone" dataKey="sleep" stroke="var(--chart-5)" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; color: string; children: React.ReactElement }) {
  return (
    <Card className="p-4">
      <p className="mb-3 text-sm font-semibold text-foreground">{title}</p>
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
      </div>
    </Card>
  );
}
