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
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 10, right: 30, bottom: 50, left: 30 }}>
          <Pie
            data={chartData}
            dataKey="votes"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, percent }) =>
              `${name.length > 10 ? name.substring(0, 10) + "..." : name} ${(
                percent * 100
              ).toFixed(0)}%`
            }
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            wrapperStyle={{ zIndex: 100 }}
            formatter={(value, name) => [`${value} votes`, name]}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              paddingTop: "20px",
              width: "100%",
              position: "absolute",
              bottom: 60,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
      >
        <XAxis
          dataKey="name"
          tickFormatter={(value) =>
            value.length > 10 ? `${value.substring(0, 10)}...` : value
          }
        />
        <YAxis />
        <Tooltip
          wrapperStyle={{ zIndex: 100 }}
          formatter={(value) => [`${value} votes`, "Votes"]}
        />
        <Legend
          verticalAlign="bottom"
          wrapperStyle={{
            paddingTop: "10px",
            position: "relative",
            bottom: 0,
            width: "100%",
          }}
        />
        <Bar dataKey="votes" name="Votes">
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
