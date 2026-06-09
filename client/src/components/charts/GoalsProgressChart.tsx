import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface Goal {
  title: string;
  progress_pct: number;
}

interface Props {
  goals: Goal[];
}

interface TooltipProps {
  active?: boolean;
  payload?: { value: number; payload: Goal }[];
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload?.length) {
    return (
      <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-md">
        <p className="text-sm font-medium">{payload[0].payload.title}</p>
        <p className="text-2xl font-bold">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const truncate = (str: string, n: number) =>
  str.length > n ? str.slice(0, n) + "…" : str;

const labelFormatter = (value: unknown) =>
  typeof value === "number" ? `${value}%` : "";

interface RoundedBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
}

const RoundedBar = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  fill,
}: RoundedBarProps) => {
  if (width <= 0) return null;
  const r = Math.min(6, height / 2);
  return (
    <rect x={x} y={y} width={width} height={height} rx={r} ry={r} fill={fill} />
  );
};

export function GoalsProgressChart({ goals }: Props) {
  if (goals.length === 0) {
    return (
      <div className="h-50 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Nenhuma meta ainda</p>
      </div>
    );
  }

  const data = goals.map((g) => ({
    ...g,
    progress_pct: Number(g.progress_pct),
    fill:
      Number(g.progress_pct) === 0
        ? "var(--color-muted-foreground)"
        : Number(g.progress_pct) >= 100
          ? "var(--color-chart-2)"
          : Number(g.progress_pct) >= 50
            ? "var(--color-chart-1)"
            : "var(--color-chart-3)",
  }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(180, goals.length * 44)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 8, right: 40, top: 4, bottom: 4 }}
        barSize={12}
      >
        <XAxis
          type="number"
          domain={[0, 100]}
          unit="%"
          allowDecimals={false}
          tick={{ fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickCount={5}
        />
        <YAxis
          type="category"
          dataKey="title"
          width={110}
          tick={{ fontSize: 12 }}
          tickFormatter={(v: string) => truncate(v, 14)}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
        <Bar
          dataKey="progress_pct"
          shape={<RoundedBar />}
          background={{ fill: "var(--color-muted)", radius: 6 }}
          minPointSize={12}
        >
          <LabelList
            dataKey="progress_pct"
            position="right"
            formatter={labelFormatter}
            style={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
