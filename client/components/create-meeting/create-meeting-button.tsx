'use client';

import { useState } from 'react';

import { CreateMeetingDialog } from '@/components/create-meeting/create-meeting-dialog';
import { Button } from '@/components/ui/button';

interface CreateMeetingButtonProps {
  children: React.ReactNode;
  size?: 'icon-sm' | 'sm' | 'lg' | 'default' | 'xs' | 'icon' | 'icon-xs' | 'icon-lg';
  className?: string;
}

export default function CreateMeetingButton({
  children,
  size,
  className,
}: Readonly<CreateMeetingButtonProps>) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <>
      <Button size={size} className={className} onClick={() => setCreateDialogOpen(true)}>
        {children}
      </Button>

      <CreateMeetingDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </>
  );
}
