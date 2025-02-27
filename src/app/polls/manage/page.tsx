"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Poll } from "@/types/poll";
import { AlertCircle, Plus } from "lucide-react";

export default function ManagePolls() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/polls/manage");
      setPolls(response.data.data || []);
    } catch (error) {
      console.error("Error fetching polls:", error);
      setError("Failed to load your polls");
    } finally {
      setLoading(false);
    }
  };

  const getPollStatus = (poll: Poll) => {
    if (poll.isClosed) return <Badge variant="destructive">Closed</Badge>;
    if (poll.isPaused) return <Badge variant="secondary">Paused</Badge>;
    return <Badge variant="default">Active</Badge>;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start space-y-1.5">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-4 w-1/2 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mt-2" />
                <div className="flex flex-wrap gap-2 mt-6">
                  <Skeleton className="h-9 w-20 flex-1" />
                  <Skeleton className="h-9 w-20 flex-1" />
                  <Skeleton className="h-9 w-20 flex-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Manage Polls</h1>
        <Button
          onClick={() => router.push("/polls/new")}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> Create New Poll
        </Button>
      </div>

      {polls.length === 0 ? (
        <div className="text-center py-8 flex flex-col justify-center items-center min-h-[60vh]">
          <p className="text-gray-500 text-lg">
            You haven't created any polls yet
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Create your first poll to get started
          </p>
          <Button onClick={() => router.push("/polls/new")} className="mt-6">
            Create Your First Poll
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <Card key={poll.pollId} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <CardTitle className="text-xl truncate">
                    {poll.name}
                  </CardTitle>
                  {getPollStatus(poll)}
                </div>
                <CardDescription>
                  {new Date(poll.startDate).toLocaleDateString()} -{" "}
                  {new Date(poll.endDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {poll.options.length} options •{" "}
                    {poll.isMulti ? "Multi-select" : "Single-select"}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/polls/manage/${poll.pollId}`)
                      }
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/polls/${poll.pollId}`)}
                      className="flex-1"
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/polls/${poll.pollId}/results`)
                      }
                      className="flex-1"
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
