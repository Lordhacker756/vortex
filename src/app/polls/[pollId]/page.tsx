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

        setPoll(pollResponse.data.data);
        setCanVote(canVoteResponse.data.data || false);

        if (!canVoteResponse.data.data) {
          toast.error(
            canVoteResponse.data.message || "You cannot vote in this poll"
          );
          router.push(`/polls/${resolvedParams.pollId}/results`);
        }
      } catch (err) {
        toast.error("Failed to load poll");
      } finally {
        setLoading(false);
      }
    };

    fetchPollData();
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

  if (!poll || !canVote) {
    return <div>Poll not found or you cannot vote</div>;
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
          <Button onClick={handleVote} className="mt-4 w-full">
            Cast Vote
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
