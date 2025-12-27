'use client';

import { format } from 'date-fns';
import { CalendarIcon, Clock, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib';

interface DatePickerProps {
  id?: string;
  value?: string;
  onChange: (date: string | undefined) => void;
  placeholder?: string;
  buttonClassName?: string;
  align?: 'start' | 'end' | 'center';
  disabled?: boolean;
  timePicker?: boolean;
}

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = 'Pick a date',
  buttonClassName,
  align = 'start',
  disabled = false,
  timePicker = false,
}: Readonly<DatePickerProps>) {
  return (
    <div
      className={
        timePicker ? 'flex flex-col gap-x-[1.8rem] gap-y-2 sm:flex-row sm:items-start' : ''
      }
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal sm:w-[160px]',
              !value && 'text-muted-foreground',
              buttonClassName
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {value ? format(new Date(value), 'MMM d, yyyy') : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={(date) => onChange(date?.toISOString())}
            autoFocus
          />
          {value && (
            <div className="mt-[-18px] border-t p-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onChange(undefined)}
                disabled={disabled}
              >
                <X className="mr-2 size-4" />
                Clear
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
      {timePicker && (
        <div className="relative">
          {value && <Clock className="absolute top-1/2 left-3 size-4 -translate-y-1/2" />}
          <Input
            id="edit-time"
            type="time"
            className="w-full pl-9 sm:w-[160px]"
            hidden={!!value === false}
            onChange={(e) => {
              if (value && e.target.value) {
                const date = new Date(value);
                const [hours, minutes] = e.target.value.split(':');
                date.setHours(Number.parseInt(hours), Number.parseInt(minutes));
                onChange(date.toISOString());
              }
            }}
            value={value ? new Date(value).toTimeString().slice(0, 5) : ''}
          />
        </div>
      )}
    </div>
  );
}
