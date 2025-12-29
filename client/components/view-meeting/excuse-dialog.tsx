'use client';

import { useEffect, useTransition } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { sendExcuse } from '@/actions';
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
import { CreateResponseFormValues, createResponseSchema } from '@/schemas';
import type { CreateResponse } from '@/types';

interface ExcuseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meetingId: string;
  userName: string;
  setUserName: (name: string) => void;
}

export function ExcuseDialog({
  open,
  onOpenChange,
  meetingId,
  userName,
  setUserName,
}: Readonly<ExcuseDialogProps>) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<CreateResponseFormValues>({
    resolver: zodResolver(createResponseSchema),
    defaultValues: { owner: '', message: '' },
  });

  useEffect(() => {
    if (userName) {
      form.reset((prev) => ({
        ...prev,
        owner: userName,
      }));
    }
  }, [userName, form]);

  const onSubmit = (data: CreateResponse) => {
    setUserName(data.owner);
    startTransition(async () => {
      try {
        await sendExcuse(meetingId, data);
        onOpenChange(false);
        form.reset();
      } catch (error) {
        console.error('Failed to send excuse:', error);
        toast.error('Failed to send excuse. Please try again.');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send an Excuse</DialogTitle>
          <DialogDescription>Let the organizer know why you can&apos;t attend.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="excuse-owner">Your Name</FieldLabel>
            <FieldContent>
              <Input id="excuse-owner" placeholder="Enter your name" {...form.register('owner')} />
              <FieldError errors={[form.formState.errors.owner]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="excuse-message">Your Message</FieldLabel>
            <FieldContent>
              <Textarea
                id="excuse-message"
                placeholder="Explain why you can't attend..."
                rows={3}
                {...form.register('message')}
              />
              <FieldError errors={[form.formState.errors.message]} />
            </FieldContent>
          </Field>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Excuse'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
