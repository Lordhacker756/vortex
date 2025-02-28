"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Poll } from "@/types/poll";
import { PollForm, PollFormData } from "@/components/forms/PollForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EditPoll() {
  const params = useParams();
  const router = useRouter();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPoll();
  }, [params.pollId]);

  const fetchPoll = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/api/polls/${params.pollId}`);
      setPoll(response.data.data);
    } catch (error) {
      console.error("Error fetching poll:", error);
      toast.error("Failed to load poll");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: PollFormData) => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.patch(
        `/api/polls/${params.pollId}`,
        {
          name: formData.name,
          isMulti: formData.isMulti,
          startDate: formData.startDate?.toISOString(),
          endDate: formData.endDate?.toISOString(),
        }
      );
      if (response.status === 200) {
        toast.success("Poll updated successfully!");
        router.push("/polls/manage");
      }
    } catch (error) {
      toast.error("Failed to update poll");
      console.error("Error updating poll:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClosePoll = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/polls/${params.pollId}/close`
      );
      if (response.status === 200) {
        toast.success("Poll closed successfully!");
        router.push("/polls/manage");
      }
    } catch (error) {
      toast.error("Failed to close poll");
      console.error("Error closing poll:", error);
    }
  };

  const handleResetPoll = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/polls/${params.pollId}/reset`
      );
      if (response.status === 200) {
        toast.success("Poll votes reset successfully!");
        fetchPoll(); // Refresh the poll data
      }
    } catch (error) {
      toast.error("Failed to reset poll votes");
      console.error("Error resetting poll:", error);
    }
  };

  if (isLoading)
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[60vh]">
        <p className="text-lg">Loading poll data...</p>
      </div>
    );

  if (!poll)
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-red-500">Poll not found</p>
        <Button
          onClick={() => router.push("/polls/manage")}
          className="mx-auto block mt-4"
        >
          Back to Manage Polls
        </Button>
      </div>
    );

  return (
    <div className="container mx-auto mt-10 p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Poll</CardTitle>
        </CardHeader>
        <CardContent>
          <PollForm
            initialData={poll}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
            isSubmitting={isSubmitting}
            extraButtons={
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Close Poll
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Close poll permanently?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. The poll will no longer
                        accept votes.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClosePoll}>
                        Close Poll
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="secondary" className="w-full">
                      Reset Votes
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reset all votes?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will delete all votes for this poll. This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleResetPoll}>
                        Reset Votes
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/polls/manage")}
                >
                  Cancel
                </Button>
              </div>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
