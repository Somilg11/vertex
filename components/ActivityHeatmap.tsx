"use client";

import React, { useMemo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, subDays, eachDayOfInterval, isSameDay, startOfYear } from "date-fns";
import clsx from "clsx";

interface ActivityHeatmapProps {
    activityDates: string[];
}

export function ActivityHeatmap({ activityDates }: ActivityHeatmapProps) {
    const today = new Date();
    // Show last 365 days or just current year? GitHub shows last year. Let's do last 6 months or 1 year depending on space.
    // For simplicity and mobile-friendliness, let's do last ~5 months (approx 20 weeks).
    const weeksToShow = 26;
    const daysToShow = weeksToShow * 7;
    const startDate = subDays(today, daysToShow);

    const datesToRender = useMemo(() => {
        return eachDayOfInterval({
            start: startDate,
            end: today,
        });
    }, []);

    // Helper to get activity count for a specific day
    const getActivityCount = (date: Date) => {
        // Normalize comparison to "YYYY-MM-DD" to avoid timezone headaches
        const targetStr = format(date, "yyyy-MM-dd");

        return activityDates.filter(d => {
            if (!d) return false;
            try {
                // Parse the activity date (which is typically UTC ISO) and convert to local
                const activityDate = new Date(d);
                return format(activityDate, "yyyy-MM-dd") === targetStr;
            } catch (e) {
                return false;
            }
        }).length;
    };

    // Helper to get color intensity
    const getColorClass = (count: number) => {
        if (count === 0) return "bg-secondary/40 dark:bg-zinc-800";
        if (count <= 2) return "bg-green-300 dark:bg-green-900";
        if (count <= 4) return "bg-green-400 dark:bg-green-700";
        if (count <= 6) return "bg-green-500 dark:bg-green-600";
        return "bg-green-600 dark:bg-green-500";
    };

    return (
        <Card className="p-4 sm:p-6 w-full">
            <h3 className="text-lg font-semibold mb-4">Coding Activity</h3>
            <div className="flex flex-col gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                <div className="flex gap-1 min-w-max">
                    {/* We need to render grid logic. Standard is Columns = Weeks, Rows = Days (Sun-Sat) */}
                    {/* For a simple implementation, let's just iterate weeks */}
                    {Array.from({ length: weeksToShow }).map((_, weekIndex) => {
                        const weekStartDate = new Date(startDate);
                        weekStartDate.setDate(weekStartDate.getDate() + (weekIndex * 7));

                        return (
                            <div key={weekIndex} className="flex flex-col gap-1">
                                {Array.from({ length: 7 }).map((_, dayIndex) => {
                                    const currentDate = new Date(weekStartDate);
                                    currentDate.setDate(currentDate.getDate() + dayIndex);

                                    // Don't render future dates if last week spans into future
                                    if (currentDate > today) return <div key={dayIndex} className="w-3 h-3" />;

                                    const count = getActivityCount(currentDate);

                                    return (
                                        <TooltipProvider key={dayIndex}>
                                            <Tooltip delayDuration={100}>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        className={clsx(
                                                            "w-3 h-3 rounded-[2px] transition-colors",
                                                            getColorClass(count)
                                                        )}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="text-xs">
                                                        {count} contributions on {format(currentDate, "MMM d, yyyy")}
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                <div className="flex items-center justify-end gap-2 text-[10px] text-muted-foreground mt-2">
                    <span>Less</span>
                    <div className="bg-secondary/40 dark:bg-zinc-800 w-3 h-3 rounded-[2px]" />
                    <div className="bg-green-300 dark:bg-green-900 w-3 h-3 rounded-[2px]" />
                    <div className="bg-green-500 dark:bg-green-600 w-3 h-3 rounded-[2px]" />
                    <span>More</span>
                </div>
            </div>
        </Card>
    );
}

// Helper Card component if not imported
function Card({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={clsx("rounded-xl border bg-card text-card-foreground shadow-sm", className)}>{children}</div>;
}
