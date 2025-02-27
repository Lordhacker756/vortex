"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Poll, PollOption } from "@/types/poll";
import axiosInstance from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ResultsChart } from "@/components/custom/ResultsChart";
import { AlertCircle } from "lucide-react";

export default function PollResultsPage({
  params,
}: {
  params: { pollId: string };
}) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [liveMode, setLiveMode] = useState(false);
  const [options, setOptions] = useState<PollOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/api/polls/${params.pollId}/results`
        );
        setPoll(response.data.data);
        setOptions(response.data.data?.options || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch results:", err);
        setError("Failed to load poll results");
      } finally {
        setLoading(false);
      }
    };

    if (!liveMode) {
      fetchResults();
    }
  }, [params.pollId, liveMode]);

  useEffect(() => {
    if (!liveMode) return;

    const eventSource = new EventSource(
      `http://localhost:9000/api/polls/${params.pollId}/results?live=true`,
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
  }, [params.pollId, liveMode]);

  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-[300px]" />
              <Skeleton className="h-[300px]" />
            </div>
            <div className="space-y-6 mt-6">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

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
              <ResultsChart options={options} chartType="pie" />
            </div>

            {/* Bar Chart */}
            <div className="h-[300px]">
              <ResultsChart options={options} chartType="bar" />
            </div>
          </div>

          {/* Progress bars */}
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
