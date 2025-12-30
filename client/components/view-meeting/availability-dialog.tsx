'use client';

import { useEffect, useTransition } from 'react';

import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js';
import { Loader2 } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { createAvailability } from '@/actions';
import { AvailabilityCalendar } from '@/components/common';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CreateAvailabilityFormValues, createAvailabilitySchema } from '@/schemas';
import type { GetMeeting } from '@/types';

interface AvailabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting: GetMeeting;
  userName: string;
  setUserName: (name: string) => void;
}

export function AvailabilityDialog({
  open,
  onOpenChange,
  meeting,
  userName,
  setUserName,
}: Readonly<AvailabilityDialogProps>) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateAvailabilityFormValues>({
    resolver: zodResolver(createAvailabilitySchema),
    defaultValues: { owner: '', message: '', ranges: [] },
  });

  const ranges = useWatch({ control: form.control, name: 'ranges' });
  const setRanges = (newRanges: CreateAvailabilityFormValues['ranges']) => {
    form.setValue('ranges', newRanges);
  };

  useEffect(() => {
    if (userName) {
      form.reset((prev) => ({
        ...prev,
        owner: userName,
      }));
    }
  }, [userName, form]);

  const minDate = meeting.availabilityStart ? new Date(meeting.availabilityStart) : undefined;
  const maxDate = meeting.availabilityEnd ? new Date(meeting.availabilityEnd) : undefined;

  const onSubmit = (data: CreateAvailabilityFormValues) => {
    console.log('Submitting availability with ranges:', ranges);
    if (ranges.length === 0) return;

    setUserName(data.owner);
    startTransition(async () => {
      try {
        await createAvailability(meeting.publicId, data);
        toast.success('Availability submitted successfully!');
        onOpenChange(false);
        setRanges([]);
      } catch (error) {
        console.error('Failed to submit availability:', error);
        toast.error('Failed to submit availability. Please try again.');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto md:min-w-xl">
        <DialogHeader>
          <DialogTitle>Submit Your Availability</DialogTitle>
          <DialogDescription>
            Select the times you&apos;re available for this meeting.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Field>
            <FieldLabel htmlFor="owner">Your Name</FieldLabel>
            <FieldContent>
              <Input id="owner" placeholder="Enter your name" {...form.register('owner')} />
              <FieldError errors={[form.formState.errors.owner]} />
            </FieldContent>
          </Field>

          <AvailabilityCalendar
            ranges={ranges}
            onChange={setRanges}
            minDate={minDate}
            maxDate={maxDate}
          />

          <Field>
            <FieldLabel htmlFor="message">Message (optional)</FieldLabel>
            <FieldContent>
              <Textarea
                id="message"
                placeholder="Any notes about your availability?"
                rows={2}
                {...form.register('message')}
              />
            </FieldContent>
          </Field>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || ranges.length === 0}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Availability'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
