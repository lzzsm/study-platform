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
  habits: { title: string; streak: number }[];
}

export function HabitsChart({ habits }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={habits} layout="vertical" margin={{ left: 16 }}>
        <XAxis type="number" allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="title"
          width={100}
          tick={{ fontSize: 12 }}
        />
        <Tooltip />
        <Bar dataKey="streak" radius={[0, 4, 4, 0]}>
          {habits.map((_, index) => (
            <Cell key={index} fill="hsl(var(--primary))" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
