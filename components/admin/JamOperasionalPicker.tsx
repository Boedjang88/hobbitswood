"use client";

import { useState, useEffect } from "react";
import { Clock, Calendar, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface JamOperasionalPickerProps {
  defaultValue: string;
}

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const TIMEZONES = ["WIB", "WITA", "WIT"];

export default function JamOperasionalPicker({ defaultValue }: JamOperasionalPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Parser to extract state from default value (e.g. "Senin - Sabtu, 08:00 - 17:00 WIB")
  const parseDefaultValue = () => {
    try {
      const parts = defaultValue.split(",");
      if (parts.length === 2) {
        const dayParts = parts[0].split("-").map(s => s.trim());
        const timeParts = parts[1].trim().split(" ");
        const hoursParts = timeParts[0].split("-").map(s => s.trim());
        const tz = timeParts[1] || "WIB";

        return {
          startDay: DAYS.includes(dayParts[0]) ? dayParts[0] : "Senin",
          endDay: DAYS.includes(dayParts[1]) ? dayParts[1] : "Sabtu",
          startTime: hoursParts[0] || "08:00",
          endTime: hoursParts[1] || "17:00",
          timezone: TIMEZONES.includes(tz) ? tz : "WIB"
        };
      }
    } catch (e) {
      // ignore parsing error, return fallback
    }
    return {
      startDay: "Senin",
      endDay: "Sabtu",
      startTime: "08:00",
      endTime: "17:00",
      timezone: "WIB"
    };
  };

  const initialValues = parseDefaultValue();
  const [startDay, setStartDay] = useState(initialValues.startDay);
  const [endDay, setEndDay] = useState(initialValues.endDay);
  const [startTime, setStartTime] = useState(initialValues.startTime);
  const [endTime, setEndTime] = useState(initialValues.endTime);
  const [timezone, setTimezone] = useState(initialValues.timezone);

  const [formattedValue, setFormattedValue] = useState(defaultValue);

  useEffect(() => {
    setFormattedValue(`${startDay} - ${endDay}, ${startTime} - ${endTime} ${timezone}`);
  }, [startDay, endDay, startTime, endTime, timezone]);

  return (
    <div className="w-full">
      <input type="hidden" name="jamBuka" value={formattedValue} />
      
      <div className="flex gap-2">
        <input
          type="text"
          value={formattedValue}
          readOnly
          onClick={() => setIsOpen(true)}
          className="w-full rounded-lg border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-955 px-4 py-2.5 text-sm outline-none text-brand-dark dark:text-zinc-100 cursor-pointer hover:border-brand-gold/50 transition-colors"
        />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-2.5 bg-brand-gold text-brand-dark hover:bg-brand-gold/80 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
        >
          <Clock className="w-4 h-4" />
          <span>Pilih Jam</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-[#EAEAEA] dark:border-zinc-800 p-6 overflow-hidden z-10"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EAEAEA] dark:border-zinc-800">
                <h3 className="text-sm font-bold text-brand-dark dark:text-zinc-100 flex items-center gap-2">
                  <Calendar className="w-4.5 h-4.5 text-brand-gold" />
                  Atur Jam Operasional
                </h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Day Range Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-brand-dark dark:text-brand-light mb-1.5 uppercase tracking-wider">Hari Mulai</label>
                    <select
                      value={startDay}
                      onChange={(e) => setStartDay(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 rounded-xl text-xs text-brand-dark dark:text-zinc-200 outline-none"
                    >
                      {DAYS.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-brand-dark dark:text-brand-light mb-1.5 uppercase tracking-wider">Hari Selesai</label>
                    <select
                      value={endDay}
                      onChange={(e) => setEndDay(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 rounded-xl text-xs text-brand-dark dark:text-zinc-200 outline-none"
                    >
                      {DAYS.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Time Range Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-brand-dark dark:text-brand-light mb-1.5 uppercase tracking-wider">Jam Buka</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 rounded-xl text-xs text-brand-dark dark:text-zinc-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-brand-dark dark:text-brand-light mb-1.5 uppercase tracking-wider">Jam Tutup</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 rounded-xl text-xs text-brand-dark dark:text-zinc-200 outline-none"
                    />
                  </div>
                </div>

                {/* Timezone Selection */}
                <div>
                  <label className="block text-[10px] font-bold text-brand-dark dark:text-brand-light mb-1.5 uppercase tracking-wider">Zona Waktu</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-[#EAEAEA] dark:border-zinc-800 rounded-xl text-xs text-brand-dark dark:text-zinc-200 outline-none"
                  >
                    {TIMEZONES.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-[#EAEAEA] dark:border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-brand-dark dark:text-zinc-250 text-xs font-semibold rounded-xl transition-all"
                >
                  Selesai
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
