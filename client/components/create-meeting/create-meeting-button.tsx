'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { CreateMeetingDialog } from '.';

interface CreateMeetingButtonProps {
  children: React.ReactNode;
  size?: 'icon-sm' | 'sm' | 'lg' | 'default' | 'xs' | 'icon' | 'icon-xs' | 'icon-lg';
  className?: string;
}

export function CreateMeetingButton({
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
