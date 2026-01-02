"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FileSpreadsheet, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { deleteSheet, updateSheetTitle } from "@/app/actions";
import { toast } from "sonner";

interface SheetCardProps {
    sheet: {
        _id: string;
        title: string;
        solvedQuestions: number;
        totalQuestions: number;
    };
}

export function SheetCard({ sheet }: SheetCardProps) {
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [newTitle, setNewTitle] = useState(sheet.title);

    // Rename Logic
    const handleRename = async () => {
        try {
            await updateSheetTitle(sheet._id, newTitle);
            toast.success("Sheet renamed successfully");
            setIsRenameOpen(false);
        } catch (error) {
            toast.error("Failed to rename sheet");
        }
    };

    // Delete Logic
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this sheet? This action cannot be undone.")) return;

        try {
            await deleteSheet(sheet._id);
            toast.success("Sheet deleted successfully");
        } catch (error) {
            toast.error("Failed to delete sheet");
        }
    };

    return (
        <>
            <div className="relative group">
                <Link href={`/sheet/${sheet._id}`} className="block h-full">
                    <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full relative">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium truncate pr-8">
                                {sheet.title}
                            </CardTitle>
                            <FileSpreadsheet className="h-4 w-4 text-muted-foreground shrink-0" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{sheet.solvedQuestions} / {sheet.totalQuestions}</div>
                            <p className="text-xs text-muted-foreground text-green-600 font-medium">
                                {sheet.totalQuestions > 0 ? Math.round((sheet.solvedQuestions / sheet.totalQuestions) * 100) : 0}% Complete
                            </p>
                            <Progress value={sheet.totalQuestions > 0 ? (sheet.solvedQuestions / sheet.totalQuestions) * 100 : 0} className="mt-4 h-2" />
                        </CardContent>
                    </Card>
                </Link>

                {/* Dropdown Menu (Positioned Absolute so it doesn't nest inside Link improperly if we are careful, but easier to use stopPropagation) */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background/80" onClick={(e) => e.preventDefault()}>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.preventDefault()}>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setIsRenameOpen(true); }}>
                                <Pencil className="mr-2 h-4 w-4" /> Rename
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Rename Dialog */}
            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                <DialogContent onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>Rename Sheet</DialogTitle>
                        <DialogDescription>Enter a new name for your sheet.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Sheet Title"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRenameOpen(false)}>Cancel</Button>
                        <Button onClick={handleRename}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
