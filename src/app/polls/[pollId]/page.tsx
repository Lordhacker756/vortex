"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ApiResponse, Poll } from "@/types/poll";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PollPage({
  params,
}: {
  params: Promise<{ pollId: string }>;
}) {
  const router = useRouter();
  const [poll, setPoll] = useState<Poll>();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [canVote, setCanVote] = useState(false);
  const resolvedParams = React.use(params);

  useEffect(() => {
    let mounted = true;

    const fetchPollData = async () => {
      try {
        const [pollResponse, canVoteResponse] = await Promise.all([
          axiosInstance.get<ApiResponse<Poll>>(
            `/api/polls/${resolvedParams.pollId}`
          ),
          axiosInstance.get<ApiResponse<boolean>>(
            `/api/polls/${resolvedParams.pollId}/can-vote`
          ),
        ]);

        if (mounted) {
          setPoll(pollResponse.data.data);
          setCanVote(canVoteResponse.data.data || false);

          if (!canVoteResponse.data.data) {
            // Only show toast if user actually cannot vote
            toast.error(
              canVoteResponse.data.message || "You cannot vote in this poll",
              {
                id: `cannot-vote-${resolvedParams.pollId}`, // Add unique ID to prevent duplicate toasts
              }
            );
          }
        }
      } catch (err) {
        if (mounted) {
          toast.error("Failed to load poll", {
            id: `load-error-${resolvedParams.pollId}`, // Add unique ID to prevent duplicate toasts
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchPollData();

    return () => {
      mounted = false;
    };
  }, [resolvedParams.pollId, router]);

  const handleVote = async () => {
    if (!selectedOptions.length) {
      toast.error("Please select an option");
      return;
    }

    if (!canVote) {
      toast.error("You cannot vote in this poll");
      return;
    }

    try {
      await Promise.all(
        selectedOptions.map((optionId) =>
          axiosInstance.get(
            `/api/polls/${resolvedParams.pollId}/vote?optionId=${optionId}`
          )
        )
      );

      toast.success("Vote cast successfully!");
      router.push(`/polls/${resolvedParams.pollId}/results`);
    } catch (err) {
      toast.error("Failed to cast vote");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!poll) {
    return (
      <div className="container mx-auto p-2 flex items-center justify-center h-screen">
        <h1 className="text-lg font-bold text-center text-red-500">
          No poll found for the given ID
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{poll.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {poll.isMulti ? (
            <div className="space-y-4">
              {poll.options.map((option) => (
                <div
                  key={option.optionId}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={option.optionId}
                    checked={selectedOptions.includes(option.optionId)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedOptions([
                          ...selectedOptions,
                          option.optionId,
                        ]);
                      } else {
                        setSelectedOptions(
                          selectedOptions.filter((id) => id !== option.optionId)
                        );
                      }
                    }}
                  />
                  <label htmlFor={option.optionId}>{option.optionName}</label>
                </div>
              ))}
            </div>
          ) : (
            <RadioGroup
              onValueChange={(value) => setSelectedOptions([value])}
              className="space-y-4"
            >
              {poll.options.map((option) => (
                <div
                  key={option.optionId}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem
                    value={option.optionId}
                    id={option.optionId}
                  />
                  <label htmlFor={option.optionId}>{option.optionName}</label>
                </div>
              ))}
            </RadioGroup>
          )}
          <Button
            onClick={handleVote}
            className="mt-4 w-full"
            disabled={!canVote}
          >
            {canVote
              ? "Cast Vote"
              : poll.isClosed
              ? "This poll is already closed!"
              : poll.isPaused
              ? "This poll is paued"
              : "You've already voted!"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
