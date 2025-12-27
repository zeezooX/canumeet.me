'use client';

import { useTransition } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { sendUpdate } from '@/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CreateResponseFormValues, createResponseSchema } from '@/schemas';

interface UpdateInputProps {
  privateId: string;
  owner: string;
}

export default function UpdateInput({ privateId, owner }: Readonly<UpdateInputProps>) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<CreateResponseFormValues>({
    resolver: zodResolver(createResponseSchema),
    defaultValues: { owner, message: '' },
  });

  const onSubmit = (data: CreateResponseFormValues) => {
    startTransition(async () => {
      try {
        await sendUpdate(privateId, data);
        form.reset({ owner, message: '' });
      } catch (error) {
        console.error('Failed to send update:', error);
        toast.error('Failed to send update. Please try again.');
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <Textarea
        placeholder="Post an update for all participants..."
        {...form.register('message')}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <Send className="size-4" />
              Post Update
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
