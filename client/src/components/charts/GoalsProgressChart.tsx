import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Props {
  goals: { title: string; progress_pct: number }[];
}

export function GoalsProgressChart({ goals }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={goals} layout="vertical" margin={{ left: 16 }}>
        <XAxis type="number" domain={[0, 100]} unit="%" allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="title"
          width={100}
          tick={{ fontSize: 12 }}
        />
        <Tooltip formatter={(value) => `${value}%`} />
        <Bar dataKey="progress_pct" radius={[0, 4, 4, 0]}>
          {goals.map((_, index) => (
            <Cell key={index} fill="hsl(var(--primary))" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
