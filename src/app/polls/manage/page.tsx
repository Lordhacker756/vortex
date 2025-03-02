"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Poll } from "@/types/poll";
import { PollCard } from "@/components/PollCard";
import { Skeleton } from "@/components/ui/skeleton";

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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-row justify-between items-center my-2 lg:my-8 gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Manage Polls</h1>
        <Button onClick={() => router.push("/polls/new")}>
          Create New Poll
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px]" />
          ))}
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
        <div className="grid gap-8 lg:gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <PollCard key={poll.pollId} poll={poll} showManageButton={true} />
          ))}
        </div>
      )}
    </div>
  );
}
