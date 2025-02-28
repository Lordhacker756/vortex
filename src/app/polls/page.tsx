"use client";
import { PollCard } from "@/components/PollCard";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePolls } from "@/lib/hooks/usePolls";
import { AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PollsPage() {
  const { polls, loading, error } = usePolls();
  const [alertOpen, setAlertOpen] = React.useState(!!error);

  React.useEffect(() => {
    setAlertOpen(!!error);
  }, [error]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-4">
        <div className="flex justify-between items-center my-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Active Polls</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="w-full h-[200px]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm">{error}</p>
        </div>
        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Error</AlertDialogTitle>
              <AlertDialogDescription>{error}</AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center my-4 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Active Polls</h1>
        <Link href="/polls/new">
          <Button>Create New Poll</Button>
        </Link>
      </div>
      {polls.length === 0 ? (
        <div className="text-center py-8 flex flex-col justify-center items-center min-h-[50vh]">
          <p className="text-gray-500 text-lg">No polls available</p>
          <p className="text-gray-400 text-sm mt-2">
            Create a new poll to get started
          </p>
          <Link href="/polls/new" className="mt-4">
            <Button>Create New Poll</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <PollCard key={poll.pollId} poll={poll} />
          ))}
        </div>
      )}
    </div>
  );
}
