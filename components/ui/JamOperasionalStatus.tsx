"use client";

import { useEffect, useState } from "react";

interface JamOperasionalStatusProps {
  jamBuka: string; // e.g. "Senin - Sabtu, 08:00 - 17:00 WIB"
}

const DAY_MAP: Record<string, number> = {
  Minggu: 0,
  Senin: 1,
  Selasa: 2,
  Rabu: 3,
  Kamis: 4,
  Jumat: 5,
  Sabtu: 6,
};

function parseJamBuka(jamBuka: string): {
  startDay: number;
  endDay: number;
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
} | null {
  try {
    // Format: "Senin - Sabtu, 08:00 - 17:00 WIB"
    const [dayPart, timePart] = jamBuka.split(",");
    const [startDayStr, endDayStr] = dayPart.split("-").map((s) => s.trim());
    const timeTokens = timePart.trim().split(" "); // ["08:00", "-", "17:00", "WIB"]
    const [startTimeStr, , endTimeStr] = timeTokens;

    const startDay = DAY_MAP[startDayStr] ?? -1;
    const endDay = DAY_MAP[endDayStr] ?? -1;

    const [startHour, startMin] = startTimeStr.split(":").map(Number);
    const [endHour, endMin] = endTimeStr.split(":").map(Number);

    if (startDay === -1 || endDay === -1) return null;
    return { startDay, endDay, startHour, startMin, endHour, endMin };
  } catch {
    return null;
  }
}

function isOpen(parsed: ReturnType<typeof parseJamBuka>): boolean {
  if (!parsed) return false;
  const now = new Date();
  const currentDay = now.getDay(); // 0=Sun
  const currentMin = now.getHours() * 60 + now.getMinutes();

  const { startDay, endDay, startHour, startMin, endHour, endMin } = parsed;

  // Handle week wrap (e.g. Senin=1 to Sabtu=6, or Minggu=0 to Jumat=5)
  let dayInRange: boolean;
  if (startDay <= endDay) {
    dayInRange = currentDay >= startDay && currentDay <= endDay;
  } else {
    // Wraps around Sunday
    dayInRange = currentDay >= startDay || currentDay <= endDay;
  }

  if (!dayInRange) return false;

  const openMin = startHour * 60 + startMin;
  const closeMin = endHour * 60 + endMin;
  return currentMin >= openMin && currentMin < closeMin;
}

export default function JamOperasionalStatus({ jamBuka }: JamOperasionalStatusProps) {
  const parsed = parseJamBuka(jamBuka);
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    function update() {
      setOpen(isOpen(parsed));
    }

    function scheduleNext() {
      if (!parsed) return;
      const now = new Date();
      const currentTotalMin = now.getHours() * 60 + now.getMinutes();
      const openMin = parsed.startHour * 60 + parsed.startMin;
      const closeMin = parsed.endHour * 60 + parsed.endMin;

      // Minutes until next change
      let minutesUntilNext: number;
      if (currentTotalMin < openMin) {
        minutesUntilNext = openMin - currentTotalMin;
      } else if (currentTotalMin < closeMin) {
        minutesUntilNext = closeMin - currentTotalMin;
      } else {
        // Already past closing today — next change is tomorrow's opening
        minutesUntilNext = 24 * 60 - currentTotalMin + openMin;
      }

      const ms = minutesUntilNext * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds();
      return setTimeout(() => {
        update();
        scheduleNext();
      }, ms > 0 ? ms : 1000);
    }

    update();
    const timer = scheduleNext();
    return () => { if (timer) clearTimeout(timer); };
  }, [jamBuka]);

  if (open === null) return null; // avoid hydration mismatch

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-bold ring-1 ring-inset ${
        open
          ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
          : "bg-red-500/10 text-red-400 ring-red-500/20"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          open ? "bg-emerald-400 animate-pulse" : "bg-red-400"
        }`}
      />
      {open ? "Buka" : "Tutup"}
    </span>
  );
}
