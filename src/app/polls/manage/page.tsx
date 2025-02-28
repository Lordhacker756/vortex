"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

interface PollOption {
  optionId: string;
  option_name: string;
  votes: number;
}

interface Poll {
  pollId: string;
  name: string;
  is_multi: boolean;
  is_paused: boolean;
  is_closed: boolean;
  start_date: string;
  end_date: string;
  options: PollOption[];
}

export default function ManagePolls() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/api/polls/manage");
      setPolls(response.data.data || []);
    } catch (error) {
      console.error("Error fetching polls:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPollStatus = (poll: Poll) => {
    if (poll.is_closed) return <Badge variant="destructive">Closed</Badge>;
    if (poll.is_paused) return <Badge variant="secondary">Paused</Badge>;
    return <Badge variant="default">Active</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center my-4 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Manage Polls</h1>
        <Button onClick={() => router.push("/polls/new")}>
          Create New Poll
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <p>Loading your polls...</p>
        </div>
      ) : polls.length === 0 ? (
        <div className="text-center py-8 flex flex-col justify-center items-center min-h-[50vh]">
          <p className="text-gray-500 text-lg">No polls created yet</p>
          <p className="text-gray-400 text-sm mt-2">
            Create a new poll to get started
          </p>
          <Button onClick={() => router.push("/polls/new")} className="mt-4">
            Create New Poll
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <Card key={poll.pollId}>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg sm:text-xl truncate max-w-[70%]">
                      {poll.name}
                    </CardTitle>
                    {getPollStatus(poll)}
                  </div>
                  <CardDescription className="text-xs sm:text-sm">
                    {new Date(poll.start_date).toLocaleDateString()} -{" "}
                    {new Date(poll.end_date).toLocaleDateString()}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {poll.options.length} options •{" "}
                    {poll.is_multi ? "Multi-select" : "Single-select"}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        router.push(`/polls/manage/${poll.pollId}`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        router.push(`/polls/${poll.pollId}/results`)
                      }
                    >
                      Results
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
