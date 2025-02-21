"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiResponse, Poll, PollOption } from "@/types/poll";
import axiosInstance from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function PollResultsPage({
  params,
}: {
  params: { pollId: string };
}) {
  const [poll, setPoll] = useState<Poll>();
  const [liveMode, setLiveMode] = useState(false);
  const [options, setOptions] = useState<PollOption[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axiosInstance.get<ApiResponse<Poll>>(
          `/api/polls/${params.pollId}/results`
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

  return (
    <div className="container mx-auto p-4">
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
          <div className="space-y-6">
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
