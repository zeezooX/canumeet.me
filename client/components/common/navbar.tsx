'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Calendar, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import logoFull from '@/assets/logo-full.svg';
import logoIcon from '@/assets/logo-icon.svg';
import { CreateMeetingButton } from '@/components/create-meeting';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          {/* Mobile Logo */}
          <div
            className={`relative ${isScrolled && !mobileMenuOpen ? '' : '-ml-4'} block sm:hidden`}
          >
            <AnimatePresence mode="wait">
              {isScrolled && !mobileMenuOpen ? (
                <motion.div
                  key="icon-logo"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <Image src={logoIcon} alt="CanUMeetMe" width={32} height={32} />
                </motion.div>
              ) : (
                <motion.div
                  key="full-logo"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <Image src={logoFull} alt="CanUMeetMe" width={236} height={59} priority />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Desktop Logo*/}
          <Image
            src={logoFull}
            alt="CanUMeetMe"
            width={256}
            height={64}
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
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
            }}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </motion.div>
        </Button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-border/40 border-t px-4 py-4 sm:hidden">
          <CreateMeetingButton className="w-full">
            <Calendar data-icon="inline-start" className="size-4" />
            Create Meeting
          </CreateMeetingButton>
        </div>
      )}
    </motion.header>
  );
}
