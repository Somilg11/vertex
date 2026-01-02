"use client";

import { useState, useEffect } from "react";
import { IQuestion, ISheet } from "@/models/User";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Sheet as SheetComponent,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { ExternalLink, FileEdit, Search, MoreHorizontal, Pencil, Trash2, Plus, ArrowDownToLine, Star } from "lucide-react";
import { toggleStatus, updateNotes, updateQuestionDetails, addQuestion, deleteQuestion, toggleBookmark } from "@/app/actions";
import { toast } from "sonner";
import clsx from "clsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SheetTrackerProps {
    sheet: ISheet & { _id: string; questions: (IQuestion & { _id: string })[] };
}

export function SheetTracker({ sheet }: SheetTrackerProps) {
    const [questions, setQuestions] = useState<(IQuestion & { _id: string })[]>(
        sheet.questions as (IQuestion & { _id: string })[]
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("ALL");

    // Sync local state with server state when prop updates (after revalidatePath)
    useEffect(() => {
        setQuestions(sheet.questions as (IQuestion & { _id: string })[]);
    }, [sheet.questions]);

    // Notes state
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [currentNote, setCurrentNote] = useState("");
    const [isNoteOpen, setIsNoteOpen] = useState(false);

    // Edit/Add Question state
    const [editingQuestion, setEditingQuestion] = useState<(IQuestion & { _id: string }) | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    // If editingQuestion is null but isEditOpen is true, we are in "Add Mode"
    const [editForm, setEditForm] = useState({ title: "", url: "", topics: "", difficulty: "Medium" });
    const [insertAtIndex, setInsertAtIndex] = useState<number | undefined>(undefined);


    const handleToggle = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "SOLVED" ? "PENDING" : "SOLVED";

        // Optimistic Update
        setQuestions(prev => prev.map(q =>
            q._id === id ? { ...q, status: newStatus as any } : q
        ));

        try {
            await toggleStatus(sheet._id, id, newStatus as any);
            toast.success("Status updated");
        } catch (err) {
            toast.error("Failed to update status");
            // Revert
            setQuestions(prev => prev.map(q =>
                q._id === id ? { ...q, status: currentStatus as any } : q
            ));
        }
    };

    const handleBookmark = async (id: string, currentBookmarked: boolean) => {
        const newBookmarked = !currentBookmarked;

        // Optimistic
        setQuestions(prev => prev.map(q =>
            q._id === id ? { ...q, isBookmarked: newBookmarked } : q
        ));

        try {
            await toggleBookmark(sheet._id, id, newBookmarked);
            toast.success(newBookmarked ? "Bookmarked for revision" : "Removed from bookmarks");
        } catch (err) {
            toast.error("Failed to update bookmark");
            // Revert
            setQuestions(prev => prev.map(q =>
                q._id === id ? { ...q, isBookmarked: currentBookmarked } : q
            ));
        }
    };

    const handleSaveNote = async () => {
        if (!editingNoteId) return;

        // Optimistic
        setQuestions(prev => prev.map(q =>
            q._id === editingNoteId ? { ...q, notes: currentNote } : q
        ));
        setIsNoteOpen(false);

        try {
            await updateNotes(sheet._id, editingNoteId, currentNote);
            toast.success("Note saved");
        } catch (err) {
            toast.error("Failed to save note");
        }
    };

    const openNote = (q: IQuestion & { _id: string }) => {
        setEditingNoteId(q._id);
        setCurrentNote(q.notes || "");
        setIsNoteOpen(true);
    };

    const handleDeleteQuestion = async (qId: string) => {
        if (!confirm("Are you sure you want to delete this question?")) return;

        // Optimistic
        const qToDelete = questions.find(q => q._id === qId);
        if (!qToDelete) return;

        setQuestions(prev => prev.filter(q => q._id !== qId));

        try {
            await deleteQuestion(sheet._id, qId);
            toast.success("Question deleted");
        } catch (err) {
            toast.error("Failed to delete question");
            // Revert (tricky to revert delete without re-fetching, but simplest is to just re-add it or let revalidate handle it on fail)
            setQuestions(prev => [...prev, qToDelete]);
        }
    };

    const openAddDialog = (index?: number) => {
        setEditingQuestion(null);
        setEditForm({ title: "", url: "", topics: "", difficulty: "Medium" });
        setInsertAtIndex(index);
        setIsEditOpen(true);
    };

    const openEditDialog = (q: IQuestion & { _id: string }) => {
        setEditingQuestion(q);
        // Safely handle null/undefined topics
        const topicsStr = Array.isArray(q.topics) ? q.topics.join(", ") : (q.topics || "");

        setEditForm({
            title: q.title,
            url: q.url || "",
            topics: topicsStr,
            difficulty: q.difficulty
        });
        setIsEditOpen(true);
    };

    const handleSaveEdit = async () => {
        const newTopics = editForm.topics.split(",").map(t => t.trim()).filter(Boolean);

        if (editingQuestion) {
            // EDIT MODE
            // Optimistic
            setQuestions(prev => prev.map(q =>
                q._id === editingQuestion._id ? {
                    ...q,
                    title: editForm.title,
                    url: editForm.url,
                    topics: newTopics,
                    difficulty: editForm.difficulty
                } : q
            ));
            setIsEditOpen(false);

            try {
                await updateQuestionDetails(sheet._id, editingQuestion._id, {
                    title: editForm.title,
                    url: editForm.url,
                    topics: newTopics,
                    difficulty: editForm.difficulty
                });
                toast.success("Question updated");
            } catch (err) {
                toast.error("Failed to update question");
            }
        } else {
            // ADD MODE
            setIsEditOpen(false);
            try {
                // No easy optimistic update for Add since we need the new _id from backend
                // effectively rely on revalidatePath
                await addQuestion(
                    sheet._id,
                    {
                        title: editForm.title,
                        url: editForm.url,
                        topics: newTopics,
                        difficulty: editForm.difficulty
                    },
                    insertAtIndex
                );
                toast.success("Question added");
            } catch (err) {
                toast.error("Failed to add question");
            }
        }
    };


    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "ALL" || q.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const progress = questions.length > 0
        ? Math.round((questions.filter(q => q.status === "SOLVED").length / questions.length) * 100)
        : 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{sheet.title}</h1>
                    <p className="text-muted-foreground">
                        {sheet.solvedQuestions} / {sheet.totalQuestions} Questions Solved ({progress}%)
                    </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search problems..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">Status</TableHead>
                            <TableHead className="w-[350px]">Problem</TableHead>
                            <TableHead className="w-[200px]">Topic</TableHead>
                            <TableHead className="w-[100px]">Difficulty</TableHead>
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredQuestions.map((q, index) => {
                            // Section Header Logic: If no URL is present OR Title matches Topic, treat it as a Topic/Section Header
                            const isHeader = (!q.url || q.url.trim() === "") || (q.topics?.[0]?.trim() === q.title.trim());

                            return (
                                <TableRow
                                    key={q._id}
                                    className={clsx(
                                        q.status === "SOLVED" && "bg-green-50/50 dark:bg-green-900/20",
                                        isHeader && "bg-blue-50/80 dark:bg-blue-900/10 hover:bg-blue-100/80 dark:hover:bg-blue-900/20"
                                    )}
                                >
                                    <TableCell>
                                        {!isHeader && (
                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    checked={q.status === "SOLVED"}
                                                    onCheckedChange={() => handleToggle(q._id, q.status)}
                                                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                                />
                                                <button
                                                    onClick={() => handleBookmark(q._id, q.isBookmarked || false)}
                                                    className="focus:outline-none transition-transform hover:scale-110"
                                                    title={q.isBookmarked ? "Remove bookmark" : "Bookmark for revision"}
                                                >
                                                    <Star
                                                        className={clsx(
                                                            "h-4 w-4",
                                                            q.isBookmarked
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "text-muted-foreground/40 hover:text-yellow-400"
                                                        )}
                                                    />
                                                </button>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {isHeader ? (
                                            <span className="font-bold text-base text-foreground/80 flex items-center gap-2">
                                                {q.title}
                                                {/* Optional: Add a small indicator for header */}
                                            </span>
                                        ) : (
                                            <a
                                                href={q.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={clsx(
                                                    "hover:underline flex items-center gap-2",
                                                    q.status === "SOLVED" && "text-muted-foreground line-through decoration-slate-400"
                                                )}
                                            >
                                                {q.title}
                                                <ExternalLink className="h-3 w-3 opacity-50" />
                                            </a>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {Array.isArray(q.topics) ? q.topics.map((t, i) => (
                                                <Badge key={i} variant="secondary" className="font-normal text-xs">{t}</Badge>
                                            )) : (
                                                <Badge variant="secondary" className="font-normal">{q.topics || "General"}</Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {!isHeader && (
                                            <Badge
                                                variant="outline"
                                                className={clsx(
                                                    "font-normal",
                                                    q.difficulty === "Easy" && "text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400",
                                                    q.difficulty === "Medium" && "text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400",
                                                    q.difficulty === "Hard" && "text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
                                                )}
                                            >
                                                {q.difficulty}
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditDialog(q)}>
                                                        <Pencil className="mr-2 h-4 w-4" /> Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openAddDialog(questions.findIndex(x => x._id === q._id) + 1)}>
                                                        <ArrowDownToLine className="mr-2 h-4 w-4" /> Insert Problem Below
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openNote(q)}>
                                                        <FileEdit className="mr-2 h-4 w-4" /> {q.notes ? "Edit Note" : "Add Note"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDeleteQuestion(q._id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {filteredQuestions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2">
                                        <p>No problems found.</p>
                                        <Button variant="outline" size="sm" onClick={() => openAddDialog()}>
                                            <Plus className="mr-2 h-4 w-4" /> Add Problem
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Note Sheet */}
            <SheetComponent open={isNoteOpen} onOpenChange={setIsNoteOpen}>
                <SheetContent className="flex flex-col h-full sm:max-w-md w-full p-6">
                    <SheetHeader className="mb-4">
                        <SheetTitle>Problem Notes</SheetTitle>
                        <SheetDescription>
                            Write down your approach, time complexity, or important observations.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex-1 flex flex-col gap-4">
                        <Textarea
                            placeholder="Write your notes here... (Markdown supported)"
                            className="flex-1 resize-none font-mono text-sm leading-relaxed p-4"
                            value={currentNote}
                            onChange={(e) => setCurrentNote(e.target.value)}
                        />
                        <Button className="w-full" onClick={handleSaveNote}>Save Note</Button>
                    </div>
                </SheetContent>
            </SheetComponent>

            {/* Edit/Add Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingQuestion ? "Edit Question" : (insertAtIndex !== undefined ? "Insert Question" : "Add Question")}</DialogTitle>
                        <DialogDescription>{editingQuestion ? "Make changes to the question details." : "Add a new question to this sheet."}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Title</Label>
                            <Input
                                id="title"
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="topics" className="text-right">Topics</Label>
                            <Input
                                id="topics"
                                value={editForm.topics}
                                onChange={(e) => setEditForm({ ...editForm, topics: e.target.value })}
                                className="col-span-3"
                                placeholder="Separate with commas (e.g. Array, Hash Map)"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="difficulty" className="text-right">Difficulty</Label>
                            <Input
                                id="difficulty"
                                value={editForm.difficulty}
                                onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="url" className="text-right">URL</Label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="url"
                                    value={editForm.url}
                                    onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                                />
                                <p className="text-[10px] text-muted-foreground">
                                    To make this a section header (blue row), remove the URL.
                                </p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveEdit}>{editingQuestion ? "Save Changes" : (insertAtIndex !== undefined ? "Insert" : "Add Question")}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
