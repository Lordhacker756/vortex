import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { DatePicker } from "@/components/custom/date-picker";
import { Poll } from "@/types/poll";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface PollFormProps {
  initialData?: Partial<Poll>;
  onSubmit: (formData: PollFormData) => Promise<void>;
  submitLabel?: string | React.ReactNode;
  isSubmitting?: boolean;
  extraButtons?: React.ReactNode;
}

export interface PollFormData {
  name: string;
  isMulti: boolean;
  startDate?: Date;
  endDate?: Date;
  options: string[];
}

export function PollForm({
  initialData,
  onSubmit,
  submitLabel = "Submit",
  isSubmitting = false,
  extraButtons,
}: PollFormProps) {
  const [options, setOptions] = useState<string[]>(
    initialData?.options?.map((o) => o.optionName) || ["", ""]
  );
  const [isMulti, setIsMulti] = useState(initialData?.isMulti || false);
  const [name, setName] = useState(initialData?.name || "");
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialData?.startDate ? new Date(initialData.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialData?.endDate ? new Date(initialData.endDate) : undefined
  );

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return; // Keep at least 2 options
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name,
      isMulti,
      startDate,
      endDate,
      options: options.filter((opt) => opt.trim() !== ""),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Poll Name</Label>
        <Input
          id="name"
          placeholder="Enter poll name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label>Options</Label>
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <Input
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              required={index < 2} // At least 2 options are required
              disabled={isSubmitting}
              className="flex-1"
            />
            {options.length > 2 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeOption(index)}
                disabled={isSubmitting}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove option</span>
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addOption}
          disabled={isSubmitting}
          className="mt-1"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Option
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="multi-select"
          checked={isMulti}
          onCheckedChange={setIsMulti}
          disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <DatePicker
            date={endDate}
            setDate={setEndDate}
            placeholder="Select end date"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {submitLabel}
        </Button>
        {extraButtons}
      </div>
    </form>
  );
}
