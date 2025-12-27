'use client';

import { useTransition } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { sendComment } from '@/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreateResponseFormValues, createResponseSchema } from '@/schemas';

interface CommentInputProps {
  meetingId: string;
  userName: string;
  setUserName: (name: string) => void;
}

export default function CommentInput({
  meetingId,
  userName,
  setUserName,
}: Readonly<CommentInputProps>) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<CreateResponseFormValues>({
    resolver: zodResolver(createResponseSchema),
    defaultValues: { owner: userName, message: '' },
  });

  const onSubmit = (data: CreateResponseFormValues) => {
    setUserName(data.owner);
    startTransition(async () => {
      try {
        await sendComment(meetingId, data);
        form.reset({ owner: data.owner, message: '' });
      } catch (error) {
        console.error('Failed to send comment:', error);
        toast.error('Failed to send comment. Please try again.');
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <div className="flex gap-3">
        <Input placeholder="Your name" className="w-32" {...form.register('owner')} />
        <Input placeholder="Write a comment..." className="flex-1" {...form.register('message')} />
        <Button type="submit" size="icon" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        </Button>
      </div>
    </form>
  );
}
