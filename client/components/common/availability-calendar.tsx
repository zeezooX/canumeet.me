'use client';

import { useCallback, useMemo, useState } from 'react';

import {
  addMinutes,
  addMonths,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parse,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib';
import type { CreateRange } from '@/types';

function mergeRanges(ranges: CreateRange[]): CreateRange[] {
  if (ranges.length === 0) return [];

  const sorted = [...ranges].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  const merged: CreateRange[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged.at(-1);
    if (!last) continue;

    if (isSameDay(last.startTime, current.startTime) && current.startTime <= last.endTime) {
      last.endTime = new Date(
        Math.max(new Date(last.endTime).getTime(), new Date(current.endTime).getTime())
      ).toISOString();
    } else {
      merged.push(current);
    }
  }

  return merged;
}

interface AvailabilityCalendarProps {
  ranges: CreateRange[];
  onChange: (ranges: CreateRange[]) => void;
  minDate?: Date;
  maxDate?: Date;
  slotDuration?: number;
  dayStartHour?: number;
  dayEndHour?: number;
  className?: string;
}

export default function AvailabilityCalendar({
  ranges,
  onChange,
  minDate,
  maxDate,
  slotDuration = 30,
  dayStartHour = 8,
  dayEndHour = 22,
  className,
}: Readonly<AvailabilityCalendarProps>) {
  const [currentMonth, setCurrentMonth] = useState(() => minDate || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDateRanges = useCallback(
    (date: Date) => {
      return ranges.filter((r) => isSameDay(r.startTime, date));
    },
    [ranges]
  );

  const isDateDisabled = useCallback(
    (date: Date) => {
      if (minDate && date < startOfDay(minDate)) return true;
      if (maxDate && date > endOfDay(maxDate)) return true;
      return false;
    },
    [minDate, maxDate]
  );

  const goToPreviousMonth = () => {
    setDirection('left');
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setDirection('right');
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];

    const slots: { hour: number; minute: number; time: string }[] = [];
    let hour = dayStartHour;
    let minute = 0;

    while (hour < dayEndHour) {
      slots.push({
        hour,
        minute,
        time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      });

      minute += slotDuration;
      if (minute >= 60) {
        hour += Math.floor(minute / 60);
        minute = minute % 60;
      }
    }

    return slots;
  }, [selectedDate, dayStartHour, dayEndHour, slotDuration]);

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);

  const isSlotInRange = useCallback(
    (slotIndex: number) => {
      if (!selectedDate) return false;
      const slot = timeSlots[slotIndex];
      if (!slot) return false;

      const slotStart = new Date(selectedDate);
      slotStart.setHours(slot.hour, slot.minute, 0, 0);
      const slotEnd = addMinutes(slotStart, slotDuration);

      return ranges.some((r) => {
        if (!isSameDay(new Date(r.startTime), selectedDate)) return false;
        return (
          (slotStart >= new Date(r.startTime) && slotStart < new Date(r.endTime)) ||
          (slotEnd > new Date(r.startTime) && slotEnd <= new Date(r.endTime)) ||
          (slotStart <= new Date(r.startTime) && slotEnd >= new Date(r.endTime))
        );
      });
    },
    [selectedDate, timeSlots, ranges, slotDuration]
  );

  const isSlotInCurrentSelection = useCallback(
    (slotIndex: number) => {
      if (selectionStart === null) return false;
      const end = selectionEnd ?? selectionStart;
      const min = Math.min(selectionStart, end);
      const max = Math.max(selectionStart, end);
      return slotIndex >= min && slotIndex <= max;
    },
    [selectionStart, selectionEnd]
  );

  const handleSlotMouseDown = (index: number) => {
    setIsSelecting(true);
    setSelectionStart(index);
    setSelectionEnd(index);
  };

  const handleSlotMouseEnter = (index: number) => {
    if (isSelecting) {
      setSelectionEnd(index);
    }
  };

  const handleSlotMouseUp = () => {
    if (!isSelecting || selectionStart === null || !selectedDate) {
      setIsSelecting(false);
      setSelectionStart(null);
      setSelectionEnd(null);
      return;
    }

    const end = selectionEnd ?? selectionStart;
    const minIdx = Math.min(selectionStart, end);
    const maxIdx = Math.max(selectionStart, end);

    const startSlot = timeSlots[minIdx];
    const endSlot = timeSlots[maxIdx];

    if (startSlot && endSlot) {
      const startTime = new Date(selectedDate);
      startTime.setHours(startSlot.hour, startSlot.minute, 0, 0);

      const endTime = new Date(selectedDate);
      endTime.setHours(endSlot.hour, endSlot.minute + slotDuration, 0, 0);

      const newRanges = [
        ...ranges,
        { startTime: startTime.toISOString(), endTime: endTime.toISOString() },
      ];

      const mergedRanges = mergeRanges(newRanges);
      onChange(mergedRanges);
    }

    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  const removeRange = (index: number) => {
    const newRanges = ranges.filter((_, i) => i !== index);
    onChange(newRanges);
  };

  const slideVariants = {
    enter: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? 50 : -50,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? -50 : 50,
      opacity: 0,
    }),
  };

  return (
    <div className={cn('grid gap-6 md:grid-cols-2', className)}>
      {/* Calendar */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <Button variant="ghost" size="icon-sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="size-4" />
          </Button>
          <h2 className="text-sm font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
          <Button variant="ghost" size="icon-sm" onClick={goToNextMonth}>
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div key={day} className="text-muted-foreground py-2 text-center text-xs font-medium">
              {day}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentMonth.toISOString()}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="grid grid-cols-7 gap-1"
          >
            {days.map((day) => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isDisabled = isDateDisabled(day);
              const isToday = isSameDay(day, new Date());
              const dayRanges = getDateRanges(day);
              const hasRanges = dayRanges.length > 0;

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => !isDisabled && setSelectedDate(day)}
                  disabled={isDisabled}
                  className={cn(
                    'relative aspect-square rounded-lg p-2 text-sm transition-all',
                    'hover:bg-muted focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none',
                    !isCurrentMonth && 'text-muted-foreground/50',
                    isCurrentMonth && 'text-foreground',
                    isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
                    isToday && !isSelected && 'ring-primary/50 ring-1',
                    isDisabled && 'pointer-events-none opacity-30'
                  )}
                >
                  {format(day, 'd')}
                  {hasRanges && !isSelected && (
                    <span className="bg-secondary absolute right-1 bottom-1 size-1.5 rounded-full" />
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Time slots */}
      <div className="min-h-[300px]">
        {selectedDate ? (
          <div>
            <h3 className="mb-4 text-sm font-semibold">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
            <p className="text-muted-foreground mb-3 text-xs">
              Click and drag to select available time slots
            </p>

            <div
              role="grid"
              tabIndex={0}
              className="grid grid-cols-4 gap-1 select-none"
              onMouseUp={handleSlotMouseUp}
              onMouseLeave={handleSlotMouseUp}
            >
              {timeSlots.map((slot, index) => {
                const inRange = isSlotInRange(index);
                const inSelection = isSlotInCurrentSelection(index);

                return (
                  <button
                    key={slot.time}
                    type="button"
                    onMouseDown={() => handleSlotMouseDown(index)}
                    onMouseEnter={() => handleSlotMouseEnter(index)}
                    className={cn(
                      'rounded border px-2 py-1.5 text-xs transition-colors',
                      'hover:border-primary',
                      inRange && 'bg-secondary text-secondary-foreground border-secondary',
                      inSelection && 'bg-primary/20 border-primary'
                    )}
                  >
                    {format(parse(slot.time, 'HH:mm', new Date()), 'hh:mm')}
                    <br />
                    {format(parse(slot.time, 'HH:mm', new Date()), 'a')}
                  </button>
                );
              })}
            </div>

            {/* Selected ranges for this day */}
            {getDateRanges(selectedDate).length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 text-xs font-medium">Selected times:</h4>
                <div className="flex flex-wrap gap-2">
                  {ranges
                    .map((r, i) => ({ ...r, originalIndex: i }))
                    .filter((r) => isSameDay(r.startTime, selectedDate))
                    .map((r) => (
                      <div
                        key={r.originalIndex}
                        className="bg-secondary/50 flex items-center gap-2 rounded-full px-3 py-1 text-xs"
                      >
                        <span>
                          {format(r.startTime, 'hh:mm a')} - {format(r.endTime, 'hh:mm a')}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeRange(r.originalIndex)}
                          className="hover:text-destructive transition-colors"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
            Select a date to set your availability
          </div>
        )}
      </div>

      {/* All selected ranges summary */}
      {ranges.length > 0 && (
        <div className="border-t pt-4 md:col-span-2">
          <h4 className="mb-3 text-sm font-medium">Your availability ({ranges.length} slots):</h4>
          <div className="flex flex-wrap gap-2">
            {ranges
              .toSorted((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
              .map((r) => (
                <div
                  key={r.startTime}
                  className="bg-primary/10 text-primary flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs"
                >
                  <span>
                    {format(r.startTime, 'MMM d, hh:mm a')} - {format(r.endTime, 'hh:mm a')}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const idx = ranges.findIndex((range) => range.startTime === r.startTime);
                      if (idx >= 0) removeRange(idx);
                    }}
                    className="hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
