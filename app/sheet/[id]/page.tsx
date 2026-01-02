import { getSheet } from "@/app/actions";
import { SheetTracker } from "@/components/SheetTracker";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default async function SheetPage({ params }: { params: Promise<{ id: string }> }) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const resolvedParams = await params;
    const sheet = await getSheet(resolvedParams.id);

    if (!sheet) {
        notFound();
    }

    return (
        <div className="container mx-auto py-10 px-4 md:px-6">
            <div className="mb-6">
                <Link href="/dashboard">
                    <Button variant="ghost" className="gap-2 pl-0 hover:pl-2 transition-all">
                        <ChevronLeft className="h-4 w-4" /> Back to Dashboard
                    </Button>
                </Link>
            </div>
            <SheetTracker sheet={sheet} />
        </div>
    );
}
