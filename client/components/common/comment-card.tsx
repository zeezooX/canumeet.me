'use client';

import { useState, useTransition } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, Send } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { sendReply } from '@/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CreateResponseFormValues, createResponseSchema } from '@/schemas';
import type { GetComment } from '@/types';

interface CommentCardProps {
  comment: GetComment;
  replies: GetComment[];
  meetingId: string;
  userName: string;
  setUserName: (name: string) => void;
}

export default function CommentCard({
  comment,
  replies,
  meetingId,
  userName,
  setUserName,
}: Readonly<CommentCardProps>) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateResponseFormValues>({
    resolver: zodResolver(createResponseSchema),
    defaultValues: { owner: userName, message: '' },
  });

  const onSubmitReply = (data: CreateResponseFormValues) => {
    setUserName(data.owner);
    startTransition(async () => {
      try {
        await sendReply(meetingId, comment.commentId, data);
        form.reset({ owner: data.owner, message: '' });
        setShowReplyInput(false);
        setShowReplies(true);
      } catch (error) {
        console.error('Failed to send reply:', error);
        toast.error('Failed to send reply. Please try again.');
      }
    });
  };

  return (
    <div className="space-y-2">
      <Card className={comment.isAdmin ? 'border-primary' : ''}>
        <CardContent className="py-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.owner}</span>
              {comment.isAdmin && <Badge variant="secondary">Admin</Badge>}
            </div>
            <span className="text-muted-foreground text-xs">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="mb-3 text-sm">{comment.message}</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="xs" onClick={() => setShowReplyInput(!showReplyInput)}>
              Reply
            </Button>
            {replies.length > 0 && (
              <Button variant="ghost" size="xs" onClick={() => setShowReplies(!showReplies)}>
                {showReplies ? 'Hide' : 'Show'} {replies.length} replies
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {showReplyInput && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={form.handleSubmit(onSubmitReply)}
            className="ml-6 flex gap-2"
          >
            <Input placeholder="Your name" className="w-28" {...form.register('owner')} />
            <Input
              placeholder="Write a reply..."
              className="flex-1"
              {...form.register('message')}
            />
            <Button type="submit" size="icon-sm" disabled={isPending}>
              {isPending ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Send className="size-3" />
              )}
            </Button>
          </motion.form>
        )}

        {showReplies && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-6 space-y-2"
          >
            {replies.map((reply) => (
              <Card key={reply.commentId} className="bg-muted/50">
                <CardContent className="py-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {reply.owner}
                      {reply.isAdmin && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Admin
                        </Badge>
                      )}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm">{reply.message}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
