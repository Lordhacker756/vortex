"use client";
import { PollCard } from "@/components/PollCard";
import { ApiResponse, Poll } from "@/types/poll";
import axiosInstance from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axiosInstance.get<ApiResponse<Poll[]>>(
          "/api/polls"
        );
        setPolls(response.data.data || []);
      } catch (err) {
        setError("Failed to load polls");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-3xl font-bold mb-6">Active Polls</h1>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="w-full h-[200px]" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 text-red-500 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Active Polls</h1>
        <Link href="/polls/new">
          <Button>Create New Poll</Button>
        </Link>
      </div>
      {polls.length === 0 ? (
        <div className="text-center py-8 h-screen flex flex-col justify-center items-center">
          <p className="text-gray-500 text-lg">No polls available</p>
          <p className="text-gray-400 text-sm mt-2">
            Create a new poll to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {polls.map((poll) => (
            <PollCard key={poll.pollId} poll={poll} />
          ))}
        </div>
      )}
    </div>
  );
}
