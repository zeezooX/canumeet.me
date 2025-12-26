import Link from 'next/link';

import { format } from 'date-fns';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib';
import type { GetMeeting } from '@/types';

interface MeetingCardProps {
  meeting: GetMeeting;
  href: string;
  isOwner?: boolean;
  availabilityLink?: string;
}

export default function MeetingCard({
  meeting,
  href,
  isOwner,
  availabilityLink,
}: Readonly<MeetingCardProps>) {
  return (
    <Link
      href={href}
      className="border-border bg-card hover:border-primary/50 group flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-md"
    >
      <div
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-lg',
          isOwner ? 'bg-primary/10 text-primary' : 'bg-secondary/20 text-secondary-foreground'
        )}
      >
        <Calendar className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate font-medium">{meeting.name || `${meeting.owner}'s Meeting`}</h4>
        <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-xs">
          <span>by {meeting.owner}</span>
          {meeting.date && (
            <>
              <span>•</span>
              <span>{format(new Date(meeting.date), 'MMM d, yyyy')}</span>
            </>
          )}
          {meeting.durationMins && (
            <>
              <span>•</span>
              <span>{meeting.durationMins} min</span>
            </>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {availabilityLink && (
          <Button
            variant="ghost"
            size="xs"
            asChild
            onClick={(e) => e.stopPropagation()}
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href={availabilityLink}>
              <Clock className="size-3" />
              Edit
            </Link>
          </Button>
        )}
        <ArrowRight className="text-muted-foreground group-hover:text-foreground size-4 transition-colors" />
      </div>
    </Link>
  );
}
