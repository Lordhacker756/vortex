"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiResponse, Poll, PollOption } from "@/types/poll";
import axiosInstance from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Add colors for the charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export default function PollResultsPage({
  params,
}: {
  params: Promise<{ pollId: string }>;
}) {
  const [poll, setPoll] = useState<Poll>();
  const [liveMode, setLiveMode] = useState(false);
  const [options, setOptions] = useState<PollOption[]>([]);
  const resolvedParams = React.use(params);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axiosInstance.get<ApiResponse<Poll>>(
          `/api/polls/${resolvedParams.pollId}/results`
        );
        setPoll(response.data.data);
        setOptions(response.data.data?.options || []);
      } catch (err) {
        console.error("Failed to fetch results:", err);
      }
    };

    if (!liveMode) {
      fetchResults();
    }
  }, [resolvedParams.pollId, liveMode]);

  useEffect(() => {
    if (!liveMode) return;

    const eventSource = new EventSource(
      `http://localhost:9000/api/polls/${resolvedParams.pollId}/results?live=true`,
      {
        withCredentials: true,
      }
    );

    eventSource.addEventListener("poll-update", (event) => {
      const updatedOptions = JSON.parse(event.data);
      setOptions(updatedOptions);
    });

    return () => {
      eventSource.close();
    };
  }, [resolvedParams.pollId, liveMode]);

  const formatChartData = (options: PollOption[]) => {
    return options.map((option) => ({
      name: option.optionName,
      votes: option.votes,
    }));
  };

  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{poll?.name} Results</CardTitle>
            <div className="flex items-center space-x-2">
              <Switch
                id="live-mode"
                checked={liveMode}
                onCheckedChange={setLiveMode}
              />
              <Label htmlFor="live-mode">Live Updates</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={formatChartData(options)}
                    dataKey="votes"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {options.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formatChartData(options)}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="votes" fill="#8884d8">
                    {options.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Existing progress bars */}
          <div className="space-y-6 mt-6">
            {options.map((option) => {
              const percentage = totalVotes
                ? (option.votes / totalVotes) * 100
                : 0;
              return (
                <div key={option.optionId} className="space-y-2">
                  <div className="flex justify-between">
                    <span>{option.optionName}</span>
                    <span>
                      {option.votes} votes ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={percentage} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
