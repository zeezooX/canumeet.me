import { Loader2, Settings } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Settings className="text-muted-foreground/30 size-12" />
          <Loader2 className="text-primary absolute inset-0 m-auto size-6 animate-spin" />
        </div>
        <p className="text-muted-foreground text-sm">Loading management panel...</p>
      </div>
    </div>
  );
}
