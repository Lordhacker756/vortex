"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Poll, PollOption } from "@/types/poll";
import axiosInstance, { baseURL } from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ResultsChart } from "@/components/custom/ResultsChart";
import { AlertCircle } from "lucide-react";
import { parseDateString } from "@/lib/date-utils";

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

        const pollData = response.data.data;

        // Parse dates properly if they exist
        if (pollData) {
          if (pollData.startDate) {
            pollData.startDate = parseDateString(pollData.startDate);
          }
          if (pollData.endDate) {
            pollData.endDate = parseDateString(pollData.endDate);
          }
        }

        setPoll(pollData);
        setOptions(pollData?.options || []);
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

    // Use the new dedicated live endpoint that doesn't require authentication headers
    const eventSource = new EventSource(
      `${baseURL}/api/polls/${params.pollId}/results/live`,
      { withCredentials: true }
    );

    // Add error listener for better debugging
    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      setError("Live updates connection failed");
      eventSource.close();
    };

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
      <div className="max-w-full w-full px-4 py-6 space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-[250px]" />
              <Skeleton className="h-[250px]" />
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
      <div className="max-w-full w-full px-4 py-6">
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full w-full px-4 py-6 space-y-4">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <CardTitle className="text-xl sm:text-2xl">
              {poll?.name} Results
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Switch
                id="live-mode"
                checked={liveMode}
                onCheckedChange={setLiveMode}
              />
              <Label htmlFor="live-mode" className="text-sm">
                Live Updates
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress bars */}
          <div className="space-y-4 mt-6">
            <h3 className="font-medium">Detailed Results</h3>
            {options.map((option) => {
              const percentage = totalVotes
                ? (option.votes / totalVotes) * 100
                : 0;
              return (
                <div key={option.optionId} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <span className="text-sm font-medium truncate">
                      {option.optionName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {option.votes} votes ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={percentage} />
                </div>
              );
            })}

            <div className="text-right text-sm text-muted-foreground mt-4">
              Total votes: {totalVotes}
            </div>
          </div>
          <div className="grid grid-cols-1 mt-10 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="h-[300px] sm:h-[350px] w-full">
              <ResultsChart options={options} chartType="pie" />
            </div>

            {/* Bar Chart */}
            <div className="h-[300px] sm:h-[350px] w-full">
              <ResultsChart options={options} chartType="bar" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
