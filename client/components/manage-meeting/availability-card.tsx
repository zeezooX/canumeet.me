import { useState } from 'react';

import { format, parseISO } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { GetAvailability } from '@/types';

interface AvailabilityCardProps {
  availability: GetAvailability;
}

export default function AvailabilityCard({ availability }: Readonly<AvailabilityCardProps>) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardContent className="py-4">
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-between text-left"
          onClick={() => setExpanded(!expanded)}
        >
          <div>
            <p className="font-medium">{availability.owner}</p>
            <p className="text-muted-foreground text-sm">
              {availability.ranges.length} time slot{availability.ranges.length === 1 ? '' : 's'}
            </p>
          </div>
          <span className="text-muted-foreground">
            {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </span>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              {availability.message && (
                <p className="text-muted-foreground mb-3 text-sm italic">
                  &quot;{availability.message}&quot;
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {availability.ranges.map((range) => (
                  <Badge key={range.startTime} variant="outline">
                    {format(parseISO(range.startTime), 'MMM d, h:mm a')} -{' '}
                    {format(parseISO(range.endTime), 'h:mm a')}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
