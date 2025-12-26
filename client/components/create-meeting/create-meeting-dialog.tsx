'use client';

import { useEffect, useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  Bell,
  CalendarClock,
  CalendarIcon,
  Clock,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { createMeeting } from '@/actions';
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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUserName } from '@/hooks/use-local-storage';
import { cn } from '@/lib';
import { CreateMeetingFormValues, createMeetingSchema } from '@/schemas';

import FeatureToggle from './feature-toggle';

interface CreateMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMeetingDialog({ open, onOpenChange }: Readonly<CreateMeetingDialogProps>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { userName, setUserName } = useUserName();
  const [step, setStep] = useState(1);

  const form = useForm<CreateMeetingFormValues>({
    resolver: zodResolver(createMeetingSchema),
    defaultValues: {
      owner: '',
      name: '',
      description: '',
      availabilityEnabled: true,
      commentsEnabled: true,
      updatesEnabled: true,
      excusesEnabled: true,
    },
  });

  const availabilityEnabled = useWatch({ control: form.control, name: 'availabilityEnabled' });
  const commentsEnabled = useWatch({ control: form.control, name: 'commentsEnabled' });
  const updatesEnabled = useWatch({ control: form.control, name: 'updatesEnabled' });
  const excusesEnabled = useWatch({ control: form.control, name: 'excusesEnabled' });
  const availabilityStart = useWatch({ control: form.control, name: 'availabilityStart' });
  const availabilityEnd = useWatch({ control: form.control, name: 'availabilityEnd' });
  const availabilityDeadline = useWatch({ control: form.control, name: 'availabilityDeadline' });
  const meetingDate = useWatch({ control: form.control, name: 'date' });

  useEffect(() => {
    if (userName && !form.getValues('owner')) {
      form.setValue('owner', userName);
    }
  }, [userName, form]);

  const onSubmit = (data: CreateMeetingFormValues) => {
    if (data.owner) {
      setUserName(data.owner);
    }

    startTransition(async () => {
      try {
        const result = await createMeeting(data);
        onOpenChange(false);
        router.push(`/manage/${result.privateId}`);
      } catch (error) {
        console.error('Failed to create meeting:', error);
        toast.error('Failed to create meeting. Please try again.');
      }
    });
  };

  const nextStep = async () => {
    const fieldsToValidate =
      step === 1
        ? (['owner', 'name'] as const)
        : ([
            'durationMins',
            'availabilityStart',
            'availabilityEnd',
            'availabilityDeadline',
          ] as const);

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a New Meeting</DialogTitle>
          <DialogDescription>
            Set up your meeting in just a few steps. No login required.
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                s <= step ? 'bg-primary' : 'bg-muted'
              )}
            />
          ))}
        </div>

        <form className="space-y-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Field>
                <FieldLabel htmlFor="owner">Your Name *</FieldLabel>
                <FieldContent>
                  <Input
                    id="owner"
                    placeholder="Enter your name"
                    {...form.register('owner')}
                    aria-invalid={!!form.formState.errors.owner}
                  />
                  <FieldError errors={[form.formState.errors.owner]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="name">Meeting Name</FieldLabel>
                <FieldContent>
                  <Input
                    id="name"
                    placeholder="e.g., Team Sync, Project Kickoff"
                    {...form.register('name')}
                  />
                  <FieldDescription>Optional but helps identify your meeting</FieldDescription>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <FieldContent>
                  <Textarea
                    id="description"
                    placeholder="What's this meeting about?"
                    rows={3}
                    {...form.register('description')}
                  />
                </FieldContent>
              </Field>
            </motion.div>
          )}

          {/* Step 2: Schedule */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Field>
                <FieldLabel htmlFor="durationMins">
                  <Clock className="size-4" />
                  Meeting Duration
                </FieldLabel>
                <FieldContent>
                  <div className="flex items-center gap-2">
                    <Input
                      id="durationMins"
                      type="number"
                      min={15}
                      max={480}
                      step={15}
                      className="w-24"
                      {...form.register('durationMins', {
                        setValueAs: (value) => (value ? Number.parseInt(value, 10) : undefined),
                      })}
                      aria-invalid={!!form.formState.errors.durationMins}
                    />
                    <span className="text-muted-foreground text-sm">minutes</span>
                  </div>
                  <FieldError errors={[form.formState.errors.durationMins]} />
                  <FieldDescription>How long will the meeting be?</FieldDescription>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="availabilityStart">
                  <CalendarIcon className="size-4" />
                  Availability Window
                </FieldLabel>
                <FieldContent>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <DatePicker
                      id="availabilityStart"
                      value={availabilityStart}
                      onChange={(date) => form.setValue('availabilityStart', date)}
                      placeholder="Pick a date"
                    />
                    <span className="text-muted-foreground text-sm">to</span>
                    <DatePicker
                      id="availabilityEnd"
                      value={availabilityEnd}
                      onChange={(date) => form.setValue('availabilityEnd', date)}
                      placeholder="Pick a date"
                    />
                  </div>
                  <FieldError errors={[form.formState.errors.availabilityEnd]} />
                  <FieldDescription>
                    Participants can select times within this optional window
                  </FieldDescription>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="availabilityDeadline">Response Deadline</FieldLabel>
                <FieldContent>
                  <DatePicker
                    id="availabilityDeadline"
                    value={availabilityDeadline}
                    onChange={(date) => form.setValue('availabilityDeadline', date)}
                    placeholder="No deadline"
                    buttonClassName="sm:w-[200px]"
                  />
                  <FieldError errors={[form.formState.errors.availabilityDeadline]} />
                  <FieldDescription>
                    Optional deadline for participants to submit availability
                  </FieldDescription>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="meetingDate">
                  <CalendarClock className="size-4" />
                  Meeting Date & Time
                </FieldLabel>
                <FieldContent>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                    <DatePicker
                      id="meetingDate"
                      value={meetingDate}
                      onChange={(date) => form.setValue('date', date)}
                      placeholder="Select date"
                    />
                    <Input
                      id="meetingTime"
                      type="time"
                      className="w-full sm:w-[160px]"
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
                  <FieldDescription>If you wish to skip availability collection</FieldDescription>
                </FieldContent>
              </Field>
            </motion.div>
          )}

          {/* Step 3: Features */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <p className="text-muted-foreground text-sm">
                Choose which features to enable for your meeting:
              </p>

              <div className="space-y-3">
                <FeatureToggle
                  id="availabilityEnabled"
                  label="Availability Collection"
                  description="Allow participants to submit their available times"
                  icon={<CalendarIcon className="size-4" />}
                  checked={availabilityEnabled ?? true}
                  onChange={(checked) => form.setValue('availabilityEnabled', checked)}
                />

                <FeatureToggle
                  id="commentsEnabled"
                  label="Comments"
                  description="Enable discussion and questions"
                  icon={<MessageSquare className="size-4" />}
                  checked={commentsEnabled ?? true}
                  onChange={(checked) => form.setValue('commentsEnabled', checked)}
                />

                <FeatureToggle
                  id="updatesEnabled"
                  label="Updates"
                  description="Post announcements for participants"
                  icon={<Bell className="size-4" />}
                  checked={updatesEnabled ?? true}
                  onChange={(checked) => form.setValue('updatesEnabled', checked)}
                />

                <FeatureToggle
                  id="excusesEnabled"
                  label="Excuses"
                  description="Allow participants to explain unavailability"
                  icon={<AlertCircle className="size-4" />}
                  checked={excusesEnabled ?? true}
                  onChange={(checked) => form.setValue('excusesEnabled', checked)}
                />
              </div>
            </motion.div>
          )}

          <DialogFooter className="gap-2">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
            )}

            {step < 3 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button
                type="button"
                disabled={isPending}
                onClick={async () => await form.handleSubmit(onSubmit)()}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Meeting'
                )}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
