import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  pending: number;
  completed: number;
}

export function TasksChart({ pending, completed }: Props) {
  const data = [
    { name: "Pendentes", value: pending },
    { name: "Completas", value: completed },
  ];

  const COLORS = ["hsl(var(--muted-foreground))", "hsl(var(--primary))"];

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
