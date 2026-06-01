import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  completed: number;
  inProgress: number;
  notStarted: number;
}

export function GoalsChart({ completed, inProgress, notStarted }: Props) {
  const data = [
    { name: "Completas", value: completed },
    { name: "Em progresso", value: inProgress },
    { name: "Não iniciadas", value: notStarted },
  ];

  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--muted-foreground))",
    "hsl(var(--border))",
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={4}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
