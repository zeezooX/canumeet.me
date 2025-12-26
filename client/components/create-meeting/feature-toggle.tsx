'use client';

import { cn } from '@/lib';

interface FeatureToggleProps {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function FeatureToggle({
  id,
  label,
  description,
  icon,
  checked,
  onChange,
}: Readonly<FeatureToggleProps>) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors',
        checked ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/50'
      )}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div
        className={cn(
          'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors',
          checked ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
        )}
      >
        {checked && (
          <svg
            className="size-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{icon}</span>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>
      </div>
    </label>
  );
}
