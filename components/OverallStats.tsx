"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ListTodo, Target } from "lucide-react";

interface OverallStatsProps {
    totalQuestions: number;
    solvedQuestions: number;
}

export function OverallStats({ totalQuestions, solvedQuestions }: OverallStatsProps) {
    const progress = totalQuestions > 0 ? Math.round((solvedQuestions / totalQuestions) * 100) : 0;

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold">{progress}%</span>
                        <span className="text-sm text-muted-foreground">Complete</span>
                    </div>
                    <div className="text-right">
                        <span className="text-xl font-semibold text-green-600">{solvedQuestions}</span>
                        <span className="text-muted-foreground mx-1">/</span>
                        <span className="text-lg text-muted-foreground">{totalQuestions}</span>
                    </div>
                </div>
                <Progress value={progress} className="h-2 w-full bg-secondary" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Solved</p>
                            <p className="text-lg font-bold">{solvedQuestions}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <ListTodo className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Pending</p>
                            <p className="text-lg font-bold">{totalQuestions - solvedQuestions}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
