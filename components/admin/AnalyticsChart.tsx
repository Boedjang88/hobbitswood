"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface AnalyticsChartProps {
  data: {
    name: string;
    views: number;
  }[];
}

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) {
    return <div style={{ height: 400, width: '100%' }} className="mt-6 flex items-center justify-center text-sm text-brand-dark/50 dark:text-brand-light/50">Memuat grafik...</div>;
  }

  // Determine theme mode safe from hydration errors
  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

  const strokeColor = isDark ? "#FAFAF7" : "#111111";
  const gridColor = isDark ? "#27272a" : "#EAEAEA"; // zinc-800 or #EAEAEA
  const tooltipBg = isDark ? "#18181b" : "#ffffff"; // zinc-900 or white
  const tooltipText = isDark ? "#fafafa" : "#111111";
  const tooltipBorder = isDark ? "#27272a" : "#eaeaea";

  return (
    <div style={{ height: 400, width: '100%' }} className="mt-6">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={undefined} initialDimension={{ width: 100, height: 400 }}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={isMobile ? false : { fill: "#999", fontSize: 12 }} 
            dy={10}
            angle={isMobile ? 0 : -35}
            textAnchor={isMobile ? "middle" : "end"}
            height={isMobile ? 20 : 120}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#999", fontSize: 12 }} 
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: tooltipBg, 
              color: tooltipText, 
              borderRadius: '8px', 
              border: `1px solid ${tooltipBorder}`, 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
            }}
            itemStyle={{ color: tooltipText }}
            cursor={false}
          />
          <Bar 
            dataKey="views" 
            fill={strokeColor} 
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
            activeBar={{ stroke: strokeColor, strokeWidth: 4, fill: strokeColor, filter: 'drop-shadow(0px 0px 8px rgba(120,120,120,0.4))' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
