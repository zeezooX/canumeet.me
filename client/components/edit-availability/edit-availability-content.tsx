'use client';

import { useState, useTransition } from 'react';

import Link from 'next/link';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Check, Clock, Copy, LinkIcon, Loader2, Save } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { modifyAvailability } from '@/actions';
import { AvailabilityCalendar } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CreateAvailabilityFormValues } from '@/schemas';
import type { GetAvailability, GetMeeting } from '@/types';

interface EditAvailabilityContentProps {
  meeting: GetMeeting;
  availability: GetAvailability;
}

export function EditAvailabilityContent({
  meeting,
  availability,
}: Readonly<EditAvailabilityContentProps>) {
  const [isPending, startTransition] = useTransition();
  const [editCopied, setEditCopied] = useState(false);

  const form = useForm<CreateAvailabilityFormValues>({
    defaultValues: {
      owner: availability.owner,
      message: availability.message || '',
      ranges: availability.ranges.map((range) => {
        return {
          startTime: range.startTime,
          endTime: range.endTime,
        };
      }),
    },
  });

  const ranges = useWatch({ control: form.control, name: 'ranges' });
  const setRanges = (newRanges: CreateAvailabilityFormValues['ranges']) => {
    form.setValue('ranges', newRanges);
  };

  const minDate = meeting.availabilityStart ? new Date(meeting.availabilityStart) : undefined;
  const maxDate = meeting.availabilityEnd ? new Date(meeting.availabilityEnd) : undefined;

  const onSubmit = (data: CreateAvailabilityFormValues) => {
    if (ranges.length === 0) return;

    startTransition(async () => {
      try {
        await modifyAvailability(meeting.publicId, availability.privateId, data);
        toast('Availability updated successfully!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error('Failed to update availability:', error);
        toast.error('Failed to update availability. Please try again.');
      }
    });
  };

  const editUrl = `https://canumeet.me/${meeting.publicId}/${availability.privateId}`;

  const copyEditUrl = () => {
    navigator.clipboard.writeText(editUrl);
    setEditCopied(true);
    setTimeout(() => setEditCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link
          href={`/meeting/${meeting.publicId}`}
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to meeting
        </Link>

        <h1 className="mb-2 text-3xl font-bold">Edit Your Availability</h1>

        <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
          <span className="flex items-center gap-1">
            <Calendar className="size-4" />
            {meeting.name || `${meeting.owner}'s Meeting`}
          </span>
          {meeting.durationMins && (
            <span className="flex items-center gap-1">
              <Clock className="size-4" />
              {meeting.durationMins} min
            </span>
          )}
        </div>
      </motion.div>

      {/* Edit Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card>
          <CardContent className="py-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex-1">
                <p className="mb-1 text-sm font-medium">Use this link to edit your availability</p>
                <div className="bg-muted flex items-center gap-2 rounded-lg px-3 py-2">
                  <LinkIcon className="text-muted-foreground size-4 shrink-0" />
                  <code className="flex-1 truncate text-sm">{editUrl}</code>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={copyEditUrl}>
                  {editCopied ? (
                    <>
                      <Check className="size-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Owner info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full text-lg font-bold">
              {availability.owner.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{availability.owner}</p>
              <p className="text-muted-foreground text-sm">
                Editing availability submitted {format(new Date(availability.createdAt), 'PPP')}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Select Your Available Times</CardTitle>
              <CardDescription>
                Click and drag on the time slots to select when you&apos;re available.
                {minDate && maxDate && (
                  <span className="mt-1 block">
                    Available window: {format(minDate, 'PP')} - {format(maxDate, 'PP')}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AvailabilityCalendar
                ranges={ranges}
                onChange={setRanges}
                minDate={minDate}
                maxDate={maxDate}
              />
            </CardContent>
          </Card>

          {/* Message */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>Add any notes about your availability (optional)</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., I have a hard stop at 3pm on Tuesday..."
                rows={3}
                {...form.register('message')}
              />
            </CardContent>
          </Card>

          {/* Summary */}
          {ranges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>
                  You&apos;ve selected {ranges.length} time slot{ranges.length === 1 ? '' : 's'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {ranges
                    .toSorted(
                      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
                    )
                    .map((range) => (
                      <Badge key={range.startTime} variant="secondary">
                        {format(range.startTime, 'MMM d, h:mm a')} -{' '}
                        {format(range.endTime, 'h:mm a')}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button variant="outline" asChild>
              <Link href={`/meeting/${meeting.publicId}`}>
                <ArrowLeft data-icon="inline-start" className="size-4" />
                Return to Meeting
              </Link>
            </Button>

            <Button type="submit" disabled={isPending || ranges.length === 0}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save data-icon="inline-start" className="size-4" />
                  Update Availability
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
