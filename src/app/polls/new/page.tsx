"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { DatePicker } from "@/components/custom/date-picker";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export default function NewPoll() {
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [isMulti, setIsMulti] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const router = useRouter();

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    const pollName = (e.target as HTMLFormElement).name.value;
    if (!pollName.trim()) {
      toast.error("Please enter a poll name");
      return;
    }

    const validOptions = options.filter((opt) => opt.trim() !== "");
    if (validOptions.length < 2) {
      toast.error("Please add at least two valid options");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User authentication error");
      return;
    }

    try {
      const response = await axiosInstance.post("/api/polls", {
        name: pollName,
        createdBy: userId,
        isMulti,
        startDate,
        endDate,
        options: validOptions,
      });

      if (response.status === 200) {
        toast.success("Poll created successfully!");
        router.push("/polls/manage");
      }
    } catch (error) {
      toast.error("Failed to create poll");
      console.error("Error creating poll:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create New Poll</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Poll Name</Label>
              <Input id="name" placeholder="Enter poll name" />
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              {options.map((option, index) => (
                <Input
                  key={index}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="mb-2"
                />
              ))}
              <Button type="button" variant="outline" onClick={addOption}>
                Add Option
              </Button>
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

            <Button type="submit" className="w-full">
              Create Poll
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
