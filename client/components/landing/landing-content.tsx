import {
  ArrowRight,
  Calendar,
  Clock,
  MessageSquare,
  Shield,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import * as motion from 'motion/react-client';

import CreateMeetingButton from '@/components/create-meeting/create-meeting-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib';
import type { GetMeeting } from '@/types';

import MeetingCard from './meeting-card';

interface LandingContentProps {
  joinedMeetings: GetMeeting[];
  createdMeetings: GetMeeting[];
  privateIds: Record<string, string>;
  availabilities: Record<string, string>;
}

export function LandingContent({
  joinedMeetings,
  createdMeetings,
  privateIds,
  availabilities,
}: Readonly<LandingContentProps>) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const hasUserData = joinedMeetings.length > 0 || createdMeetings.length > 0;

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32">
        {/* Background decorations */}
        <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-b via-transparent to-transparent" />
        <div className="bg-primary/20 pointer-events-none absolute top-0 right-0 size-96 rounded-full blur-3xl" />
        <div className="bg-secondary/20 pointer-events-none absolute bottom-0 left-0 size-96 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-4xl text-center"
        >
          <Badge variant="secondary" className="mb-6">
            <Sparkles className="size-3" />
            No login required
          </Badge>

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Schedule Meetings{' '}
            <span className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-transparent">
              Effortlessly
            </span>
          </h1>

          <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg sm:text-xl">
            A lightweight collaborative tool to find the perfect meeting time. Share a link, collect
            availability, and let CanUMeetMe find when everyone can meet.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CreateMeetingButton size="lg">
              <Calendar data-icon="inline-start" className="size-5" />
              Create a Meeting
              <ArrowRight data-icon="inline-end" className="size-5" />
            </CreateMeetingButton>
            <Button variant="outline" size="lg" asChild>
              <a href="#features">Learn More</a>
            </Button>
          </div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 grid grid-cols-3 gap-8"
          >
            {[
              { label: 'No Sign Up', icon: Shield },
              { label: 'Free Forever', icon: Zap },
              { label: 'Instant Share', icon: Users },
            ].map(({ label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="bg-primary/10 text-primary mx-auto mb-2 flex size-12 items-center justify-center rounded-full">
                  <Icon className="size-5" />
                </div>
                <p className="text-muted-foreground text-sm font-medium">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* User's Meetings Section */}
      {hasUserData && (
        <section className="border-y px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.h2 variants={item} className="mb-8 text-2xl font-semibold">
                Your Meetings
              </motion.h2>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Created Meetings */}
                {createdMeetings.length > 0 && (
                  <motion.div variants={item}>
                    <h3 className="text-muted-foreground mb-4 text-sm font-medium tracking-wide uppercase">
                      Meetings You Created
                    </h3>
                    <div className="space-y-3">
                      {createdMeetings.map((meeting) => (
                        <MeetingCard
                          key={meeting.publicId}
                          meeting={meeting}
                          href={`/manage/${privateIds[meeting.publicId]}`}
                          isOwner
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Joined Meetings */}
                {joinedMeetings.length > 0 && (
                  <motion.div variants={item}>
                    <h3 className="text-muted-foreground mb-4 text-sm font-medium tracking-wide uppercase">
                      Meetings You Joined
                    </h3>
                    <div className="space-y-3">
                      {joinedMeetings.map((meeting) => (
                        <MeetingCard
                          key={meeting.publicId}
                          meeting={meeting}
                          href={`/meeting/${meeting.publicId}`}
                          availabilityLink={
                            availabilities[meeting.publicId]
                              ? `/meeting/${meeting.publicId}/availability/${availabilities[meeting.publicId]}`
                              : undefined
                          }
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div variants={item}>
              <Badge variant="outline" className="mb-4">
                Features
              </Badge>
              <h2 className="mb-4 text-3xl font-bold">Everything You Need</h2>
              <p className="text-muted-foreground mx-auto mb-12 max-w-2xl">
                Simple yet powerful features to make scheduling meetings a breeze.
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <motion.div key={feature.title} variants={item}>
                  <Card className="group h-full transition-shadow hover:shadow-lg">
                    <CardHeader>
                      <div
                        className={cn(
                          'mx-auto mb-4 flex size-12 items-center justify-center rounded-xl transition-colors',
                          feature.iconBg
                        )}
                      >
                        <feature.icon className={cn('size-6', feature.iconColor)} />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div variants={item}>
              <Badge variant="outline" className="mb-4">
                How It Works
              </Badge>
              <h2 className="mb-12 text-3xl font-bold">Three Simple Steps</h2>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <motion.div key={step.title} variants={item} className="relative text-center">
                  <div className="bg-primary text-primary-foreground mx-auto mb-4 flex size-10 items-center justify-center rounded-full font-bold">
                    {index + 1}
                  </div>
                  <h3 className="mb-2 font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="from-primary/10 to-secondary/10 mx-auto max-w-4xl rounded-3xl bg-gradient-to-r p-8 text-center sm:p-12"
        >
          <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-xl">
            Create your first meeting in seconds. No account needed, no credit card required.
          </p>
          <CreateMeetingButton size="lg">
            <Calendar data-icon="inline-start" className="size-5" />
            Create Your Meeting
          </CreateMeetingButton>
        </motion.div>
      </section>
    </>
  );
}

const features = [
  {
    title: 'No Login Required',
    description:
      'Start scheduling immediately without creating an account. Just share the link and collect responses.',
    icon: Shield,
    iconBg: 'bg-green-100 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    title: 'Smart Scheduling',
    description:
      'Our algorithm finds the best meeting times where most participants are available.',
    icon: Sparkles,
    iconBg: 'bg-purple-100 dark:bg-purple-900/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    title: 'Real-time Collaboration',
    description: 'See availability updates instantly. Comments and updates keep everyone in sync.',
    icon: Users,
    iconBg: 'bg-blue-100 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Discussion & Updates',
    description: 'Built-in comments and announcements make coordination easy without extra tools.',
    icon: MessageSquare,
    iconBg: 'bg-orange-100 dark:bg-orange-900/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    title: 'Duration Flexibility',
    description:
      'Set any meeting duration from 15 minutes to all-day events. We find slots that fit.',
    icon: Clock,
    iconBg: 'bg-cyan-100 dark:bg-cyan-900/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    title: 'Lightning Fast',
    description: 'Built for speed. No bloat, no lag. Create and share meetings in under a minute.',
    icon: Zap,
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/20',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
  },
];

const steps = [
  {
    title: 'Create a Meeting',
    description:
      'Set up your meeting with a name, duration, and date range. Takes less than a minute.',
  },
  {
    title: 'Share the Link',
    description:
      'Send the meeting link to participants. They can submit their availability without logging in.',
  },
  {
    title: 'Find the Best Time',
    description: "We analyze everyone's availability and show you the optimal meeting times.",
  },
];
