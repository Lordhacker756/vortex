import React from "react";
import { PollOption } from "@/types/poll";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Chart colors
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#a4de6c",
  "#d0ed57",
  "#ffc658",
];

interface ResultsChartProps {
  options: PollOption[];
  chartType: "pie" | "bar";
}

export function ResultsChart({ options, chartType }: ResultsChartProps) {
  const formatChartData = (options: PollOption[]) => {
    return options.map((option) => ({
      name: option.optionName,
      votes: option.votes,
    }));
  };

  const chartData = formatChartData(options);

  if (chartType === "pie") {
    return (
      <ResponsiveContainer width="100%" height={350} className="mt-4 mb-6">
        <PieChart margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>
          <Pie
            data={chartData}
            dataKey="votes"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={80}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: "20px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350} className="mt-4 mb-6">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 10, left: 10, bottom: 30 }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: "15px" }} />
        <Bar dataKey="votes" fill="#8884d8">
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
