'use client';

import { useState } from 'react';

import Link from 'next/link';

import { format, formatDistanceToNow, formatDuration, intervalToDuration } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Bell, Calendar, Clock, Edit, MessageSquare, User } from 'lucide-react';

import CommentCard from '@/components/common/comment-card';
import CommentInput from '@/components/common/comment-input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserName } from '@/hooks/use-local-storage';
import type { GetMeeting } from '@/types';

import AvailabilityDialog from './availability-dialog';
import ExcuseDialog from './excuse-dialog';

interface ViewMeetingContentProps {
  meeting: GetMeeting;
  availabilityId?: string;
}

export function ViewMeetingContent({ meeting, availabilityId }: Readonly<ViewMeetingContentProps>) {
  const { userName, setUserName } = useUserName();
  const [activeTab, setActiveTab] = useState('details');
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  const [excuseDialogOpen, setExcuseDialogOpen] = useState(false);

  const updates = meeting.comments?.filter((c) => c.isUpdate) || [];
  const comments = meeting.comments?.filter((c) => !c.isUpdate && !c.parentId) || [];
  const replies = meeting.comments?.filter((c) => !c.isUpdate && c.parentId) || [];

  const getReplies = (parentId: number) => replies.filter((r) => r.parentId === parentId);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Meeting Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {meeting.availabilityEnabled && <Badge variant="secondary">Availability Open</Badge>}
          {meeting.commentsEnabled && <Badge variant="outline">Comments</Badge>}
          {meeting.excusesEnabled && <Badge variant="outline">Excuses</Badge>}
        </div>

        <div className="mb-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold">{meeting.name || `${meeting.owner}'s Meeting`}</h1>
          {availabilityId && (
            <Button variant="outline" asChild className="sm:ml-auto">
              <Link href={`/meeting/${meeting.publicId}/availability/${availabilityId}`}>
                <Edit data-icon="inline-start" className="size-4" />
                Edit Your Availability
              </Link>
            </Button>
          )}
        </div>

        <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
          <span className="flex items-center gap-1">
            <User className="size-4" />
            {meeting.owner}
          </span>
          {meeting.durationMins && (
            <span className="flex items-center gap-1">
              <Clock className="size-4" />
              {formatDuration(
                intervalToDuration({
                  start: 0,
                  end: meeting.durationMins * 60 * 1000,
                }),
                {
                  format: ['hours', 'minutes'],
                  zero: true,
                }
              )
                .replaceAll('hour', 'hr')
                .replaceAll('minute', 'min')}
            </span>
          )}
          {meeting.date && (
            <span className="flex items-center gap-1">
              <Calendar className="size-4" />
              {format(new Date(meeting.date), 'PPp')}
            </span>
          )}
        </div>

        {meeting.description && <p className="text-muted-foreground mt-4">{meeting.description}</p>}
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 flex flex-wrap gap-3"
      >
        {meeting.availabilityEnabled && (
          <Button onClick={() => setAvailabilityDialogOpen(true)}>
            <Calendar data-icon="inline-start" className="size-4" />
            Submit Availability
          </Button>
        )}
        {meeting.excusesEnabled && (
          <Button variant="outline" onClick={() => setExcuseDialogOpen(true)}>
            <AlertCircle data-icon="inline-start" className="size-4" />
            Send Excuse
          </Button>
        )}
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="max-w-full items-center justify-start overflow-x-auto overflow-y-hidden">
          <TabsTrigger value="details">
            <Calendar className="size-4" />
            Details
          </TabsTrigger>
          {meeting.updatesEnabled && updates.length > 0 && (
            <TabsTrigger value="updates">
              <Bell className="size-4" />
              Updates ({updates.length})
            </TabsTrigger>
          )}
          {meeting.commentsEnabled && (
            <TabsTrigger value="comments">
              <MessageSquare className="size-4" />
              Comments ({comments.length + replies.length})
            </TabsTrigger>
          )}
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Meeting Details</CardTitle>
                  <CardDescription>Information about this meeting</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <div className="grid gap-1 sm:grid-cols-3">
                      <dt className="text-muted-foreground text-sm font-medium">Organizer</dt>
                      <dd className="text-sm sm:col-span-2">{meeting.owner}</dd>
                    </div>
                    {meeting.name && (
                      <div className="grid gap-1 sm:grid-cols-3">
                        <dt className="text-muted-foreground text-sm font-medium">Meeting Name</dt>
                        <dd className="text-sm sm:col-span-2">{meeting.name}</dd>
                      </div>
                    )}
                    {meeting.description && (
                      <div className="grid gap-1 sm:grid-cols-3">
                        <dt className="text-muted-foreground text-sm font-medium">Description</dt>
                        <dd className="text-sm sm:col-span-2">{meeting.description}</dd>
                      </div>
                    )}
                    {meeting.durationMins && (
                      <div className="grid gap-1 sm:grid-cols-3">
                        <dt className="text-muted-foreground text-sm font-medium">Duration</dt>
                        <dd className="text-sm sm:col-span-2">
                          {formatDuration(
                            intervalToDuration({
                              start: 0,
                              end: meeting.durationMins * 60 * 1000,
                            }),
                            {
                              format: ['hours', 'minutes'],
                            }
                          )}
                        </dd>
                      </div>
                    )}
                    {meeting.date && (
                      <div className="grid gap-1 sm:grid-cols-3">
                        <dt className="text-muted-foreground text-sm font-medium">Date</dt>
                        <dd className="text-sm sm:col-span-2">
                          {format(new Date(meeting.date), 'EEE, MMM d, yyyy h:mm a')}
                        </dd>
                      </div>
                    )}
                    {meeting.availabilityStart && meeting.availabilityEnd && (
                      <div className="grid gap-1 sm:grid-cols-3">
                        <dt className="text-muted-foreground text-sm font-medium">
                          Availability Window
                        </dt>
                        <dd className="text-sm sm:col-span-2">
                          {`${format(new Date(meeting.availabilityStart), 'PP')} - ${format(new Date(meeting.availabilityEnd), 'PP')}`}
                        </dd>
                      </div>
                    )}
                    {meeting.availabilityDeadline && (
                      <div className="grid gap-1 sm:grid-cols-3">
                        <dt className="text-muted-foreground text-sm font-medium">
                          Response Deadline
                        </dt>
                        <dd className="text-sm sm:col-span-2">
                          {format(
                            new Date(meeting.availabilityDeadline),
                            'EEE, MMM d, yyyy h:mm a'
                          )}
                        </dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="updates" className="mt-6">
              <div className="space-y-4">
                {updates.length === 0 ? (
                  <div className="text-muted-foreground py-12 text-center">
                    <Bell className="mx-auto mb-4 size-12 opacity-50" />
                    <h3 className="mb-1 font-medium">No updates yet</h3>
                    <p className="text-sm">The organizer hasn&apos;t posted any updates.</p>
                  </div>
                ) : (
                  updates.map((update) => (
                    <Card key={update.commentId}>
                      <CardContent className="py-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Badge variant="secondary">
                            <Bell className="size-3" />
                            Update
                          </Badge>
                          <span className="text-muted-foreground text-xs">
                            {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm">{update.message}</p>
                        <p className="text-muted-foreground mt-2 text-xs">— {update.owner}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="comments" className="mt-6">
              <div className="space-y-6">
                {/* Comment input */}
                <CommentInput
                  meetingId={meeting.publicId}
                  userName={userName}
                  setUserName={setUserName}
                />

                {/* Comments list */}
                {comments.length === 0 ? (
                  <div className="text-muted-foreground py-12 text-center">
                    <MessageSquare className="mx-auto mb-4 size-12 opacity-50" />
                    <h3 className="mb-1 font-medium">No comments yet</h3>
                    <p className="text-sm">Be the first to leave a comment!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <CommentCard
                        key={comment.commentId}
                        comment={comment}
                        replies={getReplies(comment.commentId)}
                        meetingId={meeting.publicId}
                        userName={userName}
                        setUserName={setUserName}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>

      {/* Availability Dialog */}
      <AvailabilityDialog
        open={availabilityDialogOpen}
        onOpenChange={setAvailabilityDialogOpen}
        meeting={meeting}
        userName={userName}
        setUserName={setUserName}
      />

      {/* Excuse Dialog */}
      <ExcuseDialog
        open={excuseDialogOpen}
        onOpenChange={setExcuseDialogOpen}
        meetingId={meeting.publicId}
        userName={userName}
        setUserName={setUserName}
      />
    </div>
  );
}
