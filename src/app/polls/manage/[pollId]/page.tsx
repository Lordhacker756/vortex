"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { DatePicker } from "@/components/custom/date-picker";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

interface Poll {
  poll_id: string;
  name: string;
  is_multi: boolean;
  start_date: string;
  end_date: string;
  options: Array<{ option_id: string; option_name: string; votes: number }>;
}

export default function EditPoll() {
  const params = useParams();
  const router = useRouter();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isMulti, setIsMulti] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchPoll();
  }, [params.pollId]);

  const fetchPoll = async () => {
    try {
      const response = await axiosInstance.get(`/api/polls/${params.pollId}`);
      setPoll(response.data.data);
      setName(response.data.data.name);
      setIsMulti(response.data.data.is_multi);
      setStartDate(new Date(response.data.data.start_date));
      setEndDate(new Date(response.data.data.end_date));
    } catch (error) {
      console.error("Error fetching poll:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.patch(
        `/api/polls/${params.pollId}`,
        {
          name,
          isMulti,
          startDate,
          endDate,
        }
      );
      if (response.status === 200) {
        router.push("/polls/manage");
      }
    } catch (error) {
      console.error("Error updating poll:", error);
    }
  };

  if (!poll) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Poll</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Poll Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="multi-select"
                checked={isMulti}
                onCheckedChange={setIsMulti}
              />
              <Label htmlFor="multi-select">Allow multiple selections</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <DatePicker
                  date={startDate}
                  setDate={setStartDate}
                  placeholder="Select start date"
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <DatePicker
                  date={endDate}
                  setDate={setEndDate}
                  placeholder="Select end date"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Current Options</Label>
              {poll.options.map((option) => (
                <div
                  key={option.option_id}
                  className="flex items-center space-x-2"
                >
                  <Input disabled value={option.option_name} />
                  <span className="text-sm text-muted-foreground">
                    Votes: {option.votes}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <Button type="submit">Save Changes</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/polls/manage")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
