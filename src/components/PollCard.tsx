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
import { formatDateString } from "@/lib/date-utils";

interface PollCardProps {
  poll: Poll;
  showManageButton?: boolean;
}

export function PollCard({ poll, showManageButton }: PollCardProps) {
  // Handle both camelCase and snake_case property names
  const isMulti = poll.isMulti || poll.is_multi || false;
  const isPaused = poll.isPaused || poll.is_paused || false;
  const isClosed = poll.isClosed || poll.is_closed || false;

  // Format dates using the utility function, handling both property name formats
  const startDate = formatDateString(poll.startDate || poll.start_date);
  const endDate = formatDateString(poll.endDate || poll.end_date);

  // Get poll ID regardless of which format it's in
  const pollId = poll.pollId;

  // Check if the poll is currently active based on dates
  const today = new Date();
  const pollStartDate = new Date(poll.startDate || poll.start_date);
  const pollEndDate = new Date(poll.endDate || poll.end_date);
  const isActive =
    today >= pollStartDate && today <= pollEndDate && !isPaused && !isClosed;

  return (
    <Card className="w-full flex flex-col transition-all hover:shadow-md justify-between relative">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2 justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl max-w-full sm:max-w-[70%]">
              {poll.name}
            </CardTitle>
            <div className="flex flex-wrap  absolute -top-5 right-2">
              {isMulti && (
                <Badge className="shadow-sm">
                  <p className="text-xs">Multi-select</p>
                </Badge>
              )}
              {isPaused && (
                <Badge variant="secondary" className="shadow-sm">
                  Paused
                </Badge>
              )}
              {isClosed && (
                <Badge variant="destructive" className="shadow-sm">
                  Closed
                </Badge>
              )}
              {!isActive && !isPaused && !isClosed && (
                <Badge variant="secondary" className="shadow-sm">
                  Upcoming
                </Badge>
              )}
            </div>
          </div>
          <CardDescription className="text-xs sm:text-sm">
            Active from {startDate} to {endDate}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 mt-2">
          {/* For regular polls view */}
          {!showManageButton && (
            <>
              <Link href={`/polls/${pollId}`} className="flex-1">
                <Button
                  className="w-full"
                  variant="secondary"
                  disabled={!isActive}
                >
                  {isActive ? "Vote" : "Starts soon"}
                </Button>
              </Link>
              <Link href={`/polls/${pollId}/results`} className="flex-1">
                <Button className="w-full" variant="outline">
                  See Results
                </Button>
              </Link>
            </>
          )}

          {/* For manage polls view */}
          {showManageButton && (
            <>
              <div className="text-sm text-muted-foreground mb-2">
                {poll.options.length} options
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link href={`/polls/manage/${pollId}`} className="flex-1">
                  <Button className="w-full" variant="secondary">
                    Edit
                  </Button>
                </Link>
                <Link href={`/polls/${pollId}/results`} className="flex-1">
                  <Button className="w-full" variant="outline">
                    Results
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
