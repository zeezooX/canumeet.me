'use client';

import { useTransition } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarClock, CalendarIcon, Loader2 } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { updateMeeting } from '@/actions';
import { DatePicker } from '@/components/common/date-picker';
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
import { UpdateMeetingFormValues, updateMeetingSchema } from '@/schemas';
import { GetResponses } from '@/types';

interface EditMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  responses: GetResponses;
}

export default function EditMeetingDialog({
  open,
  onOpenChange,
  responses,
}: Readonly<EditMeetingDialogProps>) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateMeetingFormValues>({
    resolver: zodResolver(updateMeetingSchema),
    defaultValues: {
      name: responses.name || '',
      description: responses.description || '',
      owner: responses.owner,
      durationMins: responses.durationMins,
      date: responses.date || undefined,
      availabilityStart: responses.availabilityStart || undefined,
      availabilityEnd: responses.availabilityEnd || undefined,
      availabilityDeadline: responses.availabilityDeadline || undefined,
      availabilityEnabled: responses.availabilityEnabled,
      commentsEnabled: responses.commentsEnabled,
      updatesEnabled: responses.updatesEnabled,
      excusesEnabled: responses.excusesEnabled,
    },
  });

  const meetingDate = useWatch({ control: form.control, name: 'date' });
  const availabilityStart = useWatch({ control: form.control, name: 'availabilityStart' });
  const availabilityEnd = useWatch({ control: form.control, name: 'availabilityEnd' });
  const availabilityDeadline = useWatch({ control: form.control, name: 'availabilityDeadline' });

  const onSubmit = (data: UpdateMeetingFormValues) => {
    startTransition(async () => {
      try {
        const cleanedData = {
          ...data,
          name: data.name || null,
          description: data.description || null,
          date: data.date || null,
          durationMins: data.durationMins || null,
          availabilityStart: data.availabilityStart || null,
          availabilityEnd: data.availabilityEnd || null,
          availabilityDeadline: data.availabilityDeadline || null,
        };
        await updateMeeting(responses.privateId, cleanedData);
        onOpenChange(false);
      } catch (error) {
        console.error('Failed to update meeting:', error);
        toast.error('Failed to update meeting. Please try again.');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Meeting</DialogTitle>
          <DialogDescription>Update your meeting settings</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="edit-name">Meeting Name</FieldLabel>
            <FieldContent>
              <Input id="edit-name" {...form.register('name')} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="edit-description">Description</FieldLabel>
            <FieldContent>
              <Textarea id="edit-description" rows={3} {...form.register('description')} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="edit-duration">Duration (minutes)</FieldLabel>
            <FieldContent>
              <Input
                id="edit-duration"
                type="number"
                min={15}
                max={480}
                step={15}
                {...form.register('durationMins', {
                  setValueAs: (value) => (value ? Number.parseInt(value, 10) : undefined),
                })}
                aria-invalid={!!form.formState.errors.durationMins}
                placeholder="e.g., 30"
              />
              <FieldError errors={[form.formState.errors.durationMins]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="edit-date">
              <CalendarClock className="size-4" />
              Meeting Date & Time
            </FieldLabel>
            <FieldContent>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                <DatePicker
                  id="edit-date"
                  value={meetingDate}
                  onChange={(date) => form.setValue('date', date)}
                  placeholder="Select date"
                />
                <Input
                  id="edit-time"
                  type="time"
                  className="w-full sm:w-[160px]"
                  hidden={!!meetingDate === false}
                  onChange={(e) => {
                    if (meetingDate && e.target.value) {
                      const date = new Date(meetingDate);
                      const [hours, minutes] = e.target.value.split(':');
                      date.setHours(Number.parseInt(hours), Number.parseInt(minutes));
                      form.setValue('date', date.toISOString());
                    }
                  }}
                  value={meetingDate ? new Date(meetingDate).toTimeString().slice(0, 5) : ''}
                />
              </div>
              <FieldError errors={[form.formState.errors.date]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="edit-availability-window">
              <CalendarIcon className="size-4" />
              Availability Window
            </FieldLabel>
            <FieldContent>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <DatePicker
                  id="edit-availability-start"
                  value={availabilityStart}
                  onChange={(date) => form.setValue('availabilityStart', date)}
                  placeholder="Start date"
                />
                <span className="text-muted-foreground text-sm">to</span>
                <DatePicker
                  id="edit-availability-end"
                  value={availabilityEnd}
                  onChange={(date) => form.setValue('availabilityEnd', date)}
                  placeholder="End date"
                />
              </div>
              <FieldError errors={[form.formState.errors.availabilityEnd]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="edit-deadline">Response Deadline</FieldLabel>
            <FieldContent>
              <DatePicker
                id="edit-deadline"
                value={availabilityDeadline}
                onChange={(date) => form.setValue('availabilityDeadline', date)}
                placeholder="No deadline"
                buttonClassName="sm:w-[200px]"
              />
              <FieldError errors={[form.formState.errors.availabilityDeadline]} />
            </FieldContent>
          </Field>

          <div className="space-y-2">
            <p className="text-sm font-medium">Features</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'availabilityEnabled', label: 'Availability' },
                { key: 'commentsEnabled', label: 'Comments' },
                { key: 'updatesEnabled', label: 'Updates' },
                { key: 'excusesEnabled', label: 'Excuses' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 rounded-lg border p-2 text-sm">
                  <input
                    type="checkbox"
                    {...form.register(key as keyof UpdateMeetingFormValues)}
                    className="accent-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
