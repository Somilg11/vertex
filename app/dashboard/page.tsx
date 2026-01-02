import { getSheets } from "@/app/actions";
import { ImportSheet } from "@/components/ImportSheet";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, FileSpreadsheet } from "lucide-react";
import { ActivityHeatmap } from "@/components/ActivityHeatmap";
import { OverallStats } from "@/components/OverallStats";
import { SheetCard } from "@/components/SheetCard";

export default async function Dashboard() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const sheets: any[] = await getSheets();

    // Aggregate Data
    const totalQuestions = sheets.reduce((acc, sheet) => acc + sheet.totalQuestions, 0);
    const solvedQuestions = sheets.reduce((acc, sheet) => acc + sheet.solvedQuestions, 0);

    // Extract solvedAt dates from all questions in all sheets
    // Extract solvedAt dates from all questions in all sheets
    const activityDates: string[] = [];
    sheets.forEach(sheet => {
        if (sheet.questions) {
            sheet.questions.forEach((q: any) => {
                if (q.status === "SOLVED" && q.solvedAt) {
                    const date = new Date(q.solvedAt);
                    if (!isNaN(date.getTime())) {
                        activityDates.push(date.toISOString());
                    }
                }
            });
        }
    });

    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
                    <Link className="flex items-center gap-2 font-bold text-xl tracking-tighter" href="/dashboard">
                        <div className="h-6 w-6 bg-primary rounded-md flex items-center justify-center">
                            <span className="text-primary-foreground text-xs">V</span>
                        </div>
                        Vertex
                    </Link>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </div>
            </header>
            <main className="flex-1 container mx-auto px-4 md:px-6 py-6 pb-20">

                {/* Overview Section */}
                <section className="mb-10 space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Overall Stats Card */}
                        <div className="col-span-1 min-w-0">
                            <OverallStats totalQuestions={totalQuestions} solvedQuestions={solvedQuestions} />
                        </div>
                        {/* Heatmap Card */}
                        <div className="col-span-1 lg:col-span-2 min-w-0">
                            <ActivityHeatmap activityDates={activityDates} />
                        </div>
                    </div>
                </section>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight mb-2 sm:mb-4">Your Sheets</h2>
                        <p className="text-muted-foreground">Manage and track your DSA progress.</p>
                    </div>
                    <ImportSheet />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {sheets.map((sheet: any) => (
                        <SheetCard key={sheet._id} sheet={sheet} />
                    ))}

                    {sheets.length === 0 && (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed rounded-lg text-center text-muted-foreground">
                            <FileSpreadsheet className="h-12 w-12 mb-4 opacity-20" />
                            <h3 className="text-lg font-medium">No sheets yet</h3>
                            <p className="mb-4">Import your first sheet to get started.</p>
                            <ImportSheet />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
