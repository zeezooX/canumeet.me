'use client';

import { createContext, useContext, useMemo, useState } from 'react';

interface CreateMeetingContextType {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

const CreateMeetingContext = createContext<CreateMeetingContextType | undefined>(undefined);

export function CreateMeetingProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const value = useMemo(() => ({ isOpen, openDialog, closeDialog }), [isOpen]);

  return <CreateMeetingContext.Provider value={value}>{children}</CreateMeetingContext.Provider>;
}

export function useCreateMeetingDialog() {
  const context = useContext(CreateMeetingContext);
  if (!context) {
    throw new Error('useCreateMeetingDialog must be used within CreateMeetingProvider');
  }
  return context;
}
