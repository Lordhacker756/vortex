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
  const router = useRouter();

  useEffect(() => {
    // TODO: Fetch user's polls
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await axiosInstance.get("/api/polls/manage");
      setPolls(response.data.data || []);
    } catch (error) {
      console.error("Error fetching polls:", error);
    }
  };

  const getPollStatus = (poll: Poll) => {
    if (poll.is_closed) return <Badge variant="destructive">Closed</Badge>;
    if (poll.is_paused) return <Badge variant="secondary">Paused</Badge>;
    return <Badge variant="default">Active</Badge>;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Polls</h1>
        <Button onClick={() => router.push("/polls/new")}>
          Create New Poll
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll) => (
          <Card key={poll.pollId}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{poll.name}</CardTitle>
                {getPollStatus(poll)}
              </div>
              <CardDescription>
                {new Date(poll.start_date).toLocaleDateString()} -{" "}
                {new Date(poll.end_date).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {poll.options.length} options •{" "}
                  {poll.is_multi ? "Multi-select" : "Single-select"}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/polls/manage/${poll.pollId}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
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
    </div>
  );
}
