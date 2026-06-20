"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface AnalyticsChartProps {
  data: {
    name: string;
    views: number;
  }[];
}

// Normalize data so zero values still show as a small bar (never touch measure 1)
function normalizeData(data: AnalyticsChartProps["data"]) {
  const max = Math.max(...data.map((d) => d.views), 1);
  return data.map((d) => ({
    ...d,
    // Store real value separately; render value gets a floor so zero bars show
    _real: d.views,
    // Zero → render as 2% of max so bar is visible but clearly below "1"
    views: d.views === 0 ? Math.max(Math.round(max * 0.02), 1) : d.views,
  }));
}

// Custom tooltip that always shows the real value
const CustomTooltip = ({
  active,
  payload,
  label,
  tooltipBg,
  tooltipText,
  tooltipBorder,
}: {
  active?: boolean;
  payload?: { value: number; payload: { _real: number } }[];
  label?: string;
  tooltipBg: string;
  tooltipText: string;
  tooltipBorder: string;
}) => {
  if (active && payload && payload.length) {
    const realValue = payload[0].payload._real;
    return (
      <div
        style={{
          backgroundColor: tooltipBg,
          color: tooltipText,
          border: `1px solid ${tooltipBorder}`,
          borderRadius: 8,
          padding: "8px 14px",
          fontSize: 13,
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        }}
      >
        <p style={{ fontWeight: 600, marginBottom: 2 }}>{label}</p>
        <p>{realValue} views</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{ height: 320, width: "100%" }}
        className="mt-6 flex items-center justify-center text-sm text-brand-dark/50 dark:text-zinc-500"
      >
        Memuat grafik...
      </div>
    );
  }

  const isDark = theme === "dark" || resolvedTheme === "dark";

  // Theme-aware palette
  const barDefault = isDark ? "#52525b" : "#D4D4D8"; // zinc-600 / zinc-300
  const barActive = isDark ? "#FAFAF7" : "#0A0A0A";  // brand-light / brand-dark
  const gridColor = isDark ? "#27272a" : "#E4E4E7";
  const tooltipBg = isDark ? "#18181b" : "#ffffff";
  const tooltipText = isDark ? "#fafafa" : "#111111";
  const tooltipBorder = isDark ? "#3f3f46" : "#e4e4e7";

  const normalized = normalizeData(data);

  return (
    <div style={{ height: 320, width: "100%" }} className="mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={normalized}
          margin={{ top: 12, right: 8, bottom: isMobile ? 8 : 60, left: -10 }}
          barCategoryGap="30%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={gridColor}
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={
              isMobile
                ? false
                : { fill: isDark ? "#71717a" : "#a1a1aa", fontSize: 11 }
            }
            dy={10}
            angle={isMobile ? 0 : -35}
            textAnchor={isMobile ? "middle" : "end"}
            height={isMobile ? 10 : 80}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: isDark ? "#71717a" : "#a1a1aa", fontSize: 11 }}
            dx={-4}
            width={36}
            // Let recharts auto-scale — never force min to 0 so zero-floor bars don't anchor domain
            allowDataOverflow={false}
          />
          <Tooltip
            content={
              <CustomTooltip
                tooltipBg={tooltipBg}
                tooltipText={tooltipText}
                tooltipBorder={tooltipBorder}
              />
            }
            cursor={false}
          />
          <Bar
            dataKey="views"
            radius={[4, 4, 0, 0]}
            maxBarSize={52}
            isAnimationActive={true}
            onClick={(_, index) =>
              setActiveIndex(activeIndex === index ? null : index)
            }
            style={{ cursor: "pointer" }}
          >
            {normalized.map((entry, index) => {
              const isActive = activeIndex === index;
              const isAnyActive = activeIndex !== null;
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={isActive ? barActive : isAnyActive ? barDefault : barDefault}
                  fillOpacity={isAnyActive && !isActive ? 0.35 : 1}
                  style={{
                    transition: "fill-opacity 0.2s ease, transform 0.2s ease",
                    transformOrigin: "bottom center",
                    transform: isActive ? "scaleY(1.04)" : "scaleY(1)",
                    filter:
                      isAnyActive && !isActive
                        ? "blur(0.5px)"
                        : "none",
                  }}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
