import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Props {
  pending: number;
  completed: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number }[];
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload?.length) {
    return (
      <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-md">
        <p className="text-sm font-medium">{payload[0].name}</p>
        <p className="text-2xl font-bold">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const COLORS = ["var(--color-chart-3)", "var(--color-chart-2)"];

export function TasksChart({ pending, completed }: Props) {
  const total = pending + completed;

  const data = [
    { name: "Pendentes", value: pending, fill: COLORS[0] },
    { name: "Completas", value: completed, fill: COLORS[1] },
  ];

  if (total === 0) {
    return (
      <div className="h-50 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Nenhuma tarefa ainda</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-xs text-muted-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-6">
        <div className="text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">total</p>
        </div>
      </div>
    </div>
  );
}
