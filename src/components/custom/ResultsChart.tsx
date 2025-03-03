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

  // Custom label renderer for pie chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    name,
    percent,
    votes,
  }) => {
    if (votes <= 0) return null;

    const RADIAN = Math.PI / 180;
    // Calculate the position for the label (middle of the slice)
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only render if percentage is significant enough to show
    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10}
        fontWeight="bold"
      >
        {`${name}-${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (chartType === "pie") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 50, right: 30, bottom: 50, left: 30 }}>
          <Pie
            data={chartData}
            dataKey="votes"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            labelLine={false}
            label={renderCustomizedLabel}
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
            fontSize="8px"
            align="center"
            wrapperStyle={{
              paddingTop: "20px",
              width: "100%",
              position: "absolute",
              bottom: 10,
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
        margin={{ top: 20, right: 0, left: -30, bottom: 50 }}
      >
        <XAxis
          dataKey="name"
          tickFormatter={(value) =>
            value.length > 10 ? `${value.substring(0, 10)}...` : value
          }
          fontSize={10}
        />
        <YAxis />
        <Tooltip
          wrapperStyle={{ zIndex: 100 }}
          formatter={(value) => [`${value} votes`, "Votes"]}
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
