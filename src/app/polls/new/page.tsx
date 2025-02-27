"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { PollForm, PollFormData } from "@/components/forms/PollForm";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewPoll() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: PollFormData) => {
    if (!formData.startDate || !formData.endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (formData.options.length < 2) {
      toast.error("Please add at least two valid options");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User authentication error");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post("/api/polls", {
        name: formData.name,
        createdBy: userId,
        isMulti: formData.isMulti,
        startDate: formData.startDate,
        endDate: formData.endDate,
        options: formData.options,
      });

      if (response.status === 200) {
        toast.success("Poll created successfully!");
        router.push("/polls/manage");
      }
    } catch (error) {
      toast.error("Failed to create poll");
      console.error("Error creating poll:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Create New Poll</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </CardHeader>
        <CardContent>
          <PollForm
            onSubmit={handleSubmit}
            submitLabel={
              isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                "Create Poll"
              )
            }
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
