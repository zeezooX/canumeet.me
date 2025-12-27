import Link from 'next/link';

import { Home } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border/40 mt-auto border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
        <p className="text-muted-foreground text-sm">
          © {currentYear} CanUMeetMe. All rights reserved.
        </p>

        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          Made with <span className="animate-pulse">❤️</span> by{' '}
          <a
            href="https://github.com/zeezooX"
            className="hover:text-foreground underline transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ziyad Eslam
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            <Home className="mr-1 inline size-4" />
            Home
          </Link>
        </div>
      </div>
    </footer>
  );
}
