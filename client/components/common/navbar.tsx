'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Calendar, Menu, X } from 'lucide-react';
import { motion } from 'motion/react';

import logoFull from '@/assets/logo-full.svg';
import logoIcon from '@/assets/logo-icon.svg';
import CreateMeetingButton from '@/components/create-meeting/create-meeting-button';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="border-border/40 bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-md"
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src={logoIcon}
            alt="CanUMeetMe"
            width={32}
            height={32}
            className="block sm:hidden"
          />
          <Image
            src={logoFull}
            alt="CanUMeetMe"
            width={160}
            height={40}
            className="hidden sm:block"
            priority
          />
        </Link>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 sm:flex">
          <CreateMeetingButton size="sm">
            <Calendar data-icon="inline-start" className="size-4" />
            Create Meeting
          </CreateMeetingButton>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="sm:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-border/40 border-t px-4 py-4 sm:hidden"
        >
          <CreateMeetingButton className="w-full">
            <Calendar data-icon="inline-start" className="size-4" />
            Create Meeting
          </CreateMeetingButton>
        </motion.div>
      )}
    </motion.header>
  );
}
