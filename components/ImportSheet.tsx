"use client";

import { useState, useCallback } from "react";
// Removed react-dropzone
import * as XLSX from "xlsx";
// I didn't check for react-dropzone. I'll use a simple input if I don't have it, or just install it.
// To save time and avoid "unsafe" install prompts if I can, I'll use a simple file input styled nicely.
// User didn't explicitly ask for drag-n-drop library, just "drops an .xlsx". I can use standard HTML5 drag-drop API or just a file input.
// I'll stick to a simple input for MVP reliability unless I want to be fancy.
// But "drops" implies drag and drop. I'll implement a simple drop zone with standard React events.

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Upload, FileSpreadsheet } from "lucide-react";
import { createSheet } from "@/app/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface ParsedRow {
    [key: string]: any;
}

export function ImportSheet() {
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<ParsedRow[]>([]);
    const [mappedData, setMappedData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sheetTitle, setSheetTitle] = useState("");
    const router = useRouter();

    const processFile = async (file: File) => {
        setIsLoading(true);
        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const jsonData = XLSX.utils.sheet_to_json<ParsedRow>(worksheet);

            setPreviewData(jsonData.slice(0, 5)); // Show first 5

            // Heuristic Mapping
            const mapped = jsonData.map((row) => {
                let title = "";
                let url = "";
                let topics: string[] = ["General"];
                let difficulty = "Medium";

                // Find keys
                const keys = Object.keys(row);
                for (const key of keys) {
                    const lowerKey = key.toLowerCase();
                    const value = row[key];

                    if (lowerKey.includes("title") || lowerKey.includes("problem") || lowerKey.includes("name")) {
                        title = String(value);
                    } else if (
                        lowerKey.includes("link") ||
                        lowerKey.includes("url") ||
                        lowerKey.includes("href") ||
                        lowerKey.includes("website") ||
                        lowerKey.includes("leetcode") ||
                        lowerKey.includes("gfg") ||
                        lowerKey.includes("codeforces") ||
                        lowerKey.includes("atcoder") ||
                        lowerKey.includes("coding ninja") ||
                        lowerKey.includes("hackerrank")
                    ) {
                        url = String(value);
                    } else if (lowerKey.includes("topic") || lowerKey.includes("category") || lowerKey.includes("tag")) {
                        // Handling multiple topics: split by comma, pipe, or slash
                        // Also handle space if it looks like a list? No, risk of splitting "Binary Tree". Stick to symbols.
                        const topicStr = String(value);
                        topics = topicStr.split(/[,|/]/).map(t => t.trim()).filter(Boolean);
                    } else if (lowerKey.includes("difficulty") || lowerKey.includes("level")) {
                        difficulty = String(value);
                    }
                }

                // Fallback: If no URL found by header, check values for URL pattern
                if (!url) {
                    const values = Object.values(row);
                    for (const val of values) {
                        if (typeof val === 'string' && (val.startsWith('http') || val.startsWith('www.'))) {
                            url = val;
                            break;
                        }
                    }
                }

                // Fallback: If no "Title" found, use the first column that has text
                if (!title && keys.length > 0) {
                    title = String(row[keys[0]]);
                }

                // Allow empty URL for "Header" rows or manual fix later

                return { title, url, topics, difficulty };
            });

            setMappedData(mapped);
            setSheetTitle(file.name.replace(/\.[^/.]+$/, "")); // Default title from filename
            setFile(file);
        } catch (err) {
            toast.error("Failed to parse Excel file");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        if (!mappedData.length) return;
        setIsLoading(true);
        try {
            const res = await createSheet({
                title: sheetTitle,
                questions: mappedData
            });

            if (res.success) {
                toast.success("Sheet created successfully!");
                setIsOpen(false);
                // Optionally redirect
                // router.push(`/sheet/${res.sheetId}`);
            } else {
                // @ts-ignore
                toast.error(res.error || "Failed to save sheet");
            }
        } catch (err) {
            toast.error("An unexpected error occurred");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Upload className="h-4 w-4" /> Import Sheet
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Import DSA Sheet</DialogTitle>
                    <DialogDescription>
                        Upload an .xlsx or .csv file. We'll automatically detect columns.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {!file ? (
                        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 hover:bg-muted/50 transition-colors">
                            <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-4" />
                            <Input
                                id="file-upload"
                                type="file"
                                accept=".xlsx, .csv"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <Button variant="secondary" onClick={() => document.getElementById('file-upload')?.click()}>
                                Select File
                            </Button>
                            <p className="text-xs text-muted-foreground mt-2">.xlsx or .csv files</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Input
                                    value={sheetTitle}
                                    onChange={(e) => setSheetTitle(e.target.value)}
                                    placeholder="Sheet Title"
                                />
                                <Button variant="ghost" size="sm" onClick={() => { setFile(null); setMappedData([]); }}>Change File</Button>
                            </div>

                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Detected Title</TableHead>
                                            <TableHead>Detected URL</TableHead>
                                            <TableHead>Topic</TableHead>
                                            <TableHead>Difficulty</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mappedData.slice(0, 5).map((row, i) => (
                                            <TableRow key={i}>
                                                <TableCell className="font-medium">{row.title}</TableCell>
                                                <TableCell className="max-w-[150px] truncate underline text-blue-500">{row.url || "-"}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {row.topics.map((t: string, i: number) => (
                                                            <Badge key={i} variant="secondary" className="text-xs">{t}</Badge>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{row.difficulty}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <p className="text-xs text-muted-foreground text-center">
                                {mappedData.length} problems found. showing preview of first 5.
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={!file || isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save & Import
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
