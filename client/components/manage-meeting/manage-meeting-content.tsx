'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { format, formatDistanceToNow, parseISO } from 'date-fns';
import {
  AlertCircle,
  Bell,
  Calendar,
  Check,
  Clock,
  Copy,
  Edit,
  ExternalLink,
  Link,
  MessageSquare,
  Trash2,
  Trophy,
  User,
  Users,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import CommentCard from '@/components/common/comment-card';
import CommentInput from '@/components/common/comment-input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserName } from '@/hooks/use-local-storage';
import { getSoftCandidates, getStrictCandidates } from '@/lib/scheduler';
import { cn } from '@/lib/utils';
import type { GetResponses } from '@/types';

import AvailabilityCard from './availability-card';
import DeleteMeetingDialog from './delete-meeting-dialog';
import EditMeetingDialog from './edit-meeting-dialog';
import UpdateInput from './update-input';

interface ManageMeetingContentProps {
  responses: GetResponses;
}

export function ManageMeetingContent({ responses }: Readonly<ManageMeetingContentProps>) {
  const router = useRouter();
  const { userName, setUserName } = useUserName();
  const [activeTab, setActiveTab] = useState('overview');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [adminCopied, setAdminCopied] = useState(false);
  const [schedulerMode, setSchedulerMode] = useState<'strict' | 'soft'>('strict');

  const updates = responses.comments.filter((c) => c.isUpdate);
  const comments = responses.comments.filter((c) => !c.isUpdate && !c.parentId);
  const replies = responses.comments.filter((c) => !c.isUpdate && c.parentId);

  const getReplies = (parentId: number) => replies.filter((r) => r.parentId === parentId);

  const bestSlots = useMemo(() => {
    if (responses.availabilities.length === 0 || !responses.durationMins) return [];

    const heap =
      schedulerMode === 'strict'
        ? getStrictCandidates(responses.availabilities, responses.durationMins)
        : getSoftCandidates(responses.availabilities, responses.durationMins);

    const slots: { start: number; end: number; score: number }[] = [];
    for (let i = 0; i < 5 && heap.length > 0; i++) {
      const slot = heap.pop();
      if (slot) slots.push(slot);
    }
    return slots;
  }, [responses.availabilities, responses.durationMins, schedulerMode]);

  const shareUrl = `https://canumeet.me/${responses.publicId}`;

  const adminUrl = `https://canumeet.me/${responses.privateId}`;

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const copyAdminLink = () => {
    navigator.clipboard.writeText(adminUrl);
    setAdminCopied(true);
    setTimeout(() => setAdminCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge>Admin View</Badge>
          {responses.availabilityEnabled && <Badge variant="secondary">Availability Open</Badge>}
        </div>

        <h1 className="mb-2 text-3xl font-bold">
          {responses.name || `${responses.owner}'s Meeting`}
        </h1>

        <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
          <span className="flex items-center gap-1">
            <User className="size-4" />
            {responses.owner}
          </span>
          {responses.durationMins && (
            <span className="flex items-center gap-1">
              <Clock className="size-4" />
              {responses.durationMins} min
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="size-4" />
            {responses.availabilities.length} responses
          </span>
        </div>
      </motion.div>

      {/* Share Link */}
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
                <p className="mb-1 text-sm font-medium">Share this link with participants</p>
                <div className="bg-muted flex items-center gap-2 rounded-lg px-3 py-2">
                  <Link className="text-muted-foreground size-4 shrink-0" />
                  <code className="flex-1 truncate text-sm">{shareUrl}</code>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={copyShareLink}>
                  {shareCopied ? (
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
                <Button variant="outline" asChild>
                  <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-4" />
                    Open
                  </a>
                </Button>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex-1">
                <p className="mb-1 text-sm font-medium">Use this link to manage the meeting</p>
                <div className="bg-muted flex items-center gap-2 rounded-lg px-3 py-2">
                  <Link className="text-muted-foreground size-4 shrink-0" />
                  <code className="flex-1 truncate text-sm">{adminUrl}</code>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={copyAdminLink} className="mr-23">
                  {adminCopied ? (
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

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8 flex flex-wrap gap-3"
      >
        <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
          <Edit data-icon="inline-start" className="size-4" />
          Edit Meeting
        </Button>
        <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
          <Trash2 data-icon="inline-start" className="size-4" />
          Delete
        </Button>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="max-w-full items-center justify-start overflow-x-auto">
          <TabsTrigger value="overview">
            <Calendar className="size-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="availability">
            <Users className="size-4" />
            Availability ({responses.availabilities.length})
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Trophy className="size-4" />
            Best Times
          </TabsTrigger>
          {responses.updatesEnabled && (
            <TabsTrigger value="updates">
              <Bell className="size-4" />
              Updates
            </TabsTrigger>
          )}
          {responses.commentsEnabled && (
            <TabsTrigger value="comments">
              <MessageSquare className="size-4" />
              Comments ({responses.comments.filter((c) => !c.isUpdate).length})
            </TabsTrigger>
          )}
          {responses.excusesEnabled && (
            <TabsTrigger value="excuses">
              <AlertCircle className="size-4" />
              Excuses ({responses.excuses.length})
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
            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Meeting Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-3 text-sm">
                      {responses.name && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Name</dt>
                          <dd>{responses.name}</dd>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Organizer</dt>
                        <dd>{responses.owner}</dd>
                      </div>
                      {responses.durationMins && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Duration</dt>
                          <dd>{responses.durationMins} minutes</dd>
                        </div>
                      )}
                      {responses.date && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Date</dt>
                          <dd>{format(parseISO(responses.date), 'PPp')}</dd>
                        </div>
                      )}
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <dt className="text-muted-foreground text-sm">Responses</dt>
                        <dd className="text-2xl font-bold">{responses.availabilities.length}</dd>
                      </div>
                      <div className="text-center">
                        <dt className="text-muted-foreground text-sm">Comments</dt>
                        <dd className="text-2xl font-bold">
                          {responses.comments.filter((c) => !c.isUpdate).length}
                        </dd>
                      </div>
                      <div className="text-center">
                        <dt className="text-muted-foreground text-sm">Excuses</dt>
                        <dd className="text-2xl font-bold">{responses.excuses.length}</dd>
                      </div>
                      <div className="text-center">
                        <dt className="text-muted-foreground text-sm">Updates</dt>
                        <dd className="text-2xl font-bold">{updates.length}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Availability Tab */}
            <TabsContent value="availability" className="mt-6">
              {responses.availabilities.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Users className="text-muted-foreground mx-auto mb-4 size-12 opacity-50" />
                    <h3 className="mb-1 font-medium">No responses yet</h3>
                    <p className="text-muted-foreground text-sm">
                      Share the meeting link to collect availability from participants.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {responses.availabilities.map((avail) => (
                    <AvailabilityCard key={avail.publicId} availability={avail} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Best Times Tab */}
            <TabsContent value="schedule" className="mt-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm font-medium">Mode:</span>
                <Button
                  variant={schedulerMode === 'strict' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSchedulerMode('strict')}
                >
                  Strict
                </Button>
                <Button
                  variant={schedulerMode === 'soft' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSchedulerMode('soft')}
                >
                  Flexible
                </Button>
              </div>
              <p className="text-muted-foreground mb-6 text-sm">
                {schedulerMode === 'strict'
                  ? 'Shows times when participants are fully available for the entire duration.'
                  : 'Shows times ranked by overall availability coverage.'}
                <br />
                When you&apos;ve decided on a time, set it in{' '}
                <span className="inline-flex items-center gap-1">
                  <Edit className="size-4" />
                  Edit Meeting
                </span>
                {'.'}
              </p>

              {bestSlots.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Trophy className="text-muted-foreground mx-auto mb-4 size-12 opacity-50" />
                    <h3 className="mb-1 font-medium">No optimal times found</h3>
                    <p className="text-muted-foreground text-sm">
                      Collect more availability responses to find the best meeting times.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {bestSlots.map((slot, index) => (
                    <Card
                      key={`${slot.start}-${slot.end}`}
                      className={index === 0 ? 'border-primary' : ''}
                    >
                      <CardContent className="flex items-center gap-4 py-4">
                        <div
                          className={cn(
                            'flex size-10 items-center justify-center rounded-full font-bold',
                            index === 0
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            {format(new Date(slot.start * 60000), 'EEEE, MMMM d')}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {format(new Date(slot.start * 60000), 'h:mm a')} -{' '}
                            {format(new Date(slot.end * 60000), 'h:mm a')}
                          </p>
                        </div>
                        <Badge variant={index === 0 ? 'default' : 'secondary'}>
                          {schedulerMode === 'strict'
                            ? `${slot.score} available`
                            : `${Math.round(slot.score * 100)}% coverage`}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Updates Tab */}
            <TabsContent value="updates" className="mt-6">
              <div className="space-y-6">
                <UpdateInput privateId={responses.privateId} owner={responses.owner} />

                {updates.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Bell className="text-muted-foreground mx-auto mb-4 size-12 opacity-50" />
                      <h3 className="mb-1 font-medium">No updates yet</h3>
                      <p className="text-muted-foreground text-sm">
                        Post an update to notify all participants.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {updates.map((update) => (
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
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Comments Tab */}
            <TabsContent value="comments" className="mt-6">
              <div className="space-y-6">
                <CommentInput
                  meetingId={responses.privateId}
                  userName={userName}
                  setUserName={setUserName}
                />

                {comments.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <MessageSquare className="text-muted-foreground mx-auto mb-4 size-12 opacity-50" />
                      <h3 className="mb-1 font-medium">No comments yet</h3>
                      <p className="text-muted-foreground text-sm">
                        Start a discussion about this meeting.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <CommentCard
                        key={comment.commentId}
                        comment={comment}
                        replies={getReplies(comment.commentId)}
                        meetingId={responses.privateId}
                        userName={userName}
                        setUserName={setUserName}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Excuses Tab */}
            <TabsContent value="excuses" className="mt-6">
              {responses.excuses.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <AlertCircle className="text-muted-foreground mx-auto mb-4 size-12 opacity-50" />
                    <h3 className="mb-1 font-medium">No excuses received</h3>
                    <p className="text-muted-foreground text-sm">
                      Participants who can&apos;t attend can send excuses here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {responses.excuses.map((excuse) => (
                    <Card key={excuse.excuseId}>
                      <CardContent className="py-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium">{excuse.owner}</span>
                          <span className="text-muted-foreground text-xs">
                            {formatDistanceToNow(new Date(excuse.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm">{excuse.message}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>

      {/* Edit Dialog */}
      <EditMeetingDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        responses={responses}
      />

      {/* Delete Dialog */}
      <DeleteMeetingDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        privateId={responses.privateId}
        onSuccess={() => router.push('/')}
      />
    </div>
  );
}
