import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Poll } from "@/types/poll";
import Link from "next/link";

interface PollCardProps {
  poll: Poll;
  showManageButton?: boolean;
}

export function PollCard({ poll, showManageButton }: PollCardProps) {
  // Format dates
  const startDate = new Date(poll.startDate).toLocaleDateString();
  const endDate = new Date(poll.endDate).toLocaleDateString();

  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-xl truncate">{poll.name}</CardTitle>
          <div className="flex flex-wrap gap-2">
            {poll.isMulti && (
              <Badge>
                <p className="text-xs">Multi-select</p>
              </Badge>
            )}
            {poll.isPaused && <Badge variant="secondary">Paused</Badge>}
            {poll.isClosed && <Badge variant="destructive">Closed</Badge>}
          </div>
        </div>
        <CardDescription>
          Active from {startDate} to {endDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Link href={`/polls/${poll.pollId}`} className="flex-1">
            <Button className="w-full" variant="secondary">
              View Poll
            </Button>
          </Link>
          <Link href={`/polls/${poll.pollId}/results`} className="flex-1">
            <Button className="w-full" variant="outline">
              See Results
            </Button>
          </Link>
          {showManageButton && (
            <Link href={`/polls/manage/${poll.pollId}`} className="flex-1">
              <Button className="w-full">Manage</Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
