'use client';

import { Button } from '@/components/ui/button';

import { useCreateMeetingDialog } from '.';

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
  const { openDialog } = useCreateMeetingDialog();

  return (
    <Button size={size} className={className} onClick={openDialog}>
      {children}
    </Button>
  );
}
