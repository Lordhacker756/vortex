import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/custom/date-picker";
import { Poll } from "@/types/poll";
import { useState, useEffect } from "react";

export interface PollFormData {
  name: string;
  isMulti: boolean;
  startDate?: Date;
  endDate?: Date;
}

interface PollFormProps {
  initialData?: Poll | null;
  onSubmit: (formData: PollFormData) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  extraButtons?: React.ReactNode;
}

export function PollForm({
  initialData,
  onSubmit,
  submitLabel = "Submit",
  isSubmitting = false,
  extraButtons,
}: PollFormProps) {
  const [name, setName] = useState("");
  const [isMulti, setIsMulti] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  

  useEffect(() => {
    console.log("startDate", startDate);
    console.log("endDate", endDate);  
  }, [startDate, endDate]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setIsMulti(initialData.isMulti || false);
      if (initialData.startDate) {
        // Handle if it's a string or Date object
        setStartDate(
          initialData.startDate instanceof Date
            ? initialData.startDate
            : new Date(initialData.startDate)
        );
      }
      if (initialData.endDate) {
        // Handle if it's a string or Date object
        setEndDate(
          initialData.endDate instanceof Date
            ? initialData.endDate
            : new Date(initialData.endDate)
        );
      }
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      isMulti,
      startDate,
      endDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Poll Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter poll name"
          required
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || !name.trim()}
      >
        {isSubmitting ? "Submitting..." : submitLabel}
      </Button>

      {extraButtons}
    </form>
  );
}
