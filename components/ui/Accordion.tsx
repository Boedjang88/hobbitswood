"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Allow multiple items open simultaneously */
  allowMultiple?: boolean;
}

export default function Accordion({
  items,
  allowMultiple = false,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="divide-y divide-brand-wood/10 dark:divide-brand-light/10">
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div key={item.id}>
            <button
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between py-6 text-left transition-colors duration-300 text-brand-dark dark:text-brand-light hover:text-brand-gold dark:hover:text-brand-gold"
              aria-expanded={isOpen}
              id={`accordion-trigger-${item.id}`}
            >
              <span className="pr-4 font-serif text-lg tracking-wide">
                {item.title}
              </span>
              <ChevronDown
                size={20}
                className={`shrink-0 text-brand-dark font-medium dark:text-brand-light transition-transform duration-300 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-400 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
              role="region"
              id={`accordion-content-${item.id}`}
            >
              <div className="overflow-hidden">
                <p className="pb-6 text-sm leading-relaxed text-brand-dark/80 dark:text-brand-light/80 font-light">
                  {item.content}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
