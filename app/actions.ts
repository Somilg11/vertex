"use server";

import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import { Sheet, User, IQuestion } from "@/models/User";
import { revalidatePath } from "next/cache";

export async function createSheet(sheetData: {
    title: string;
    questions: Partial<IQuestion>[]; // questions now generally have topics[]
}) {
    try {
        const { userId, redirectToSignIn } = await auth();
        // Dynamically import currentUser to avoid static generation issues if any
        const { currentUser } = await import("@clerk/nextjs/server");

        if (!userId) return redirectToSignIn();

        await connectToDatabase();

        // Ensure user exists in our DB
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            // Fetch real user data from Clerk
            const clerkUser = await currentUser();
            const email = clerkUser?.emailAddresses[0]?.emailAddress || `${userId}@placeholder.vertex.com`;

            await User.create({
                clerkId: userId,
                email: email,
                name: clerkUser?.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() : "User"
            });
        }

        const newSheet = await Sheet.create({
            userId,
            title: sheetData.title,
            totalQuestions: sheetData.questions.length,
            solvedQuestions: 0,
            questions: sheetData.questions.map((q) => ({
                ...q,
                status: "PENDING",
                isBookmarked: false,
                notes: "",
            })),
        });

        revalidatePath("/dashboard");
        return { success: true, sheetId: newSheet._id.toString() };
    } catch (error: any) {
        console.error("Error creating sheet:", error);
        return { success: false, error: error.message || "Failed to create sheet" };
    }
}

export async function getSheets() {
    try {
        const { userId } = await auth();
        if (!userId) return [];

        await connectToDatabase();
        const sheets = await Sheet.find({ userId }).sort({ createdAt: -1 }).lean();

        // Convert _id to string for serialization
        return sheets.map(sheet => ({
            ...sheet,
            _id: sheet._id!.toString(), // Assert _id exists from DB
            questions: sheet.questions.map(q => ({ ...q, _id: q._id!.toString() }))
        }));
    } catch (error) {
        console.error("Error getting sheets:", error);
        return [];
    }
}

export async function getSheet(sheetId: string) {
    const { userId } = await auth();
    if (!userId) return null;

    await connectToDatabase();
    const sheet = await Sheet.findOne({ _id: sheetId, userId }).lean();
    if (!sheet) return null;

    return {
        ...sheet,
        _id: sheet._id!.toString(),
        questions: sheet.questions.map(q => ({ ...q, _id: q._id!.toString() }))
    };
}

export async function toggleStatus(
    sheetId: string,
    questionId: string,
    newStatus: "PENDING" | "SOLVED" | "REVISION",
) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    const sheet = await Sheet.findOne({ _id: sheetId, userId });
    if (!sheet) throw new Error("Sheet not found");

    // Use find instead of .id() to avoid TS issues with Mongoose types
    const question = sheet.questions.find((q: any) => q._id.toString() === questionId);
    if (!question) throw new Error("Question not found");

    const oldStatus = question.status;
    question.status = newStatus;

    if (oldStatus !== "SOLVED" && newStatus === "SOLVED") {
        sheet.solvedQuestions += 1;
        question.solvedAt = new Date();
    } else if (oldStatus === "SOLVED" && newStatus !== "SOLVED") {
        sheet.solvedQuestions = Math.max(0, sheet.solvedQuestions - 1);
        // Optional: clear solvedAt or keep history? keeping for now doesn't hurt, but for heatmap accuracy we might want to clear it or ignore it if status is not SOLVED.
        // Let's unset it strictly to reflect current state.
        question.solvedAt = undefined;
    }

    sheet.markModified("questions"); // Ensure Mongoose detects the change in nested subdoc
    await sheet.save();
    revalidatePath(`/sheet/${sheetId}`);
    revalidatePath("/dashboard");
    return { success: true };
}

export async function updateSheetTitle(sheetId: string, title: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();
    await Sheet.updateOne({ _id: sheetId, userId }, { title });
    revalidatePath("/dashboard");
    revalidatePath(`/sheet/${sheetId}`);
    return { success: true };
}

export async function toggleBookmark(sheetId: string, questionId: string, isBookmarked: boolean) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    await Sheet.updateOne(
        { _id: sheetId, userId, "questions._id": questionId },
        {
            $set: { "questions.$.isBookmarked": isBookmarked }
        }
    );

    revalidatePath(`/sheet/${sheetId}`);
    return { success: true };
}

export async function updateNotes(
    sheetId: string,
    questionId: string,
    notes: string,
) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    await Sheet.updateOne(
        { _id: sheetId, userId, "questions._id": questionId },
        { $set: { "questions.$.notes": notes } },
    );

    revalidatePath(`/sheet/${sheetId}`);
    return { success: true };
}

export async function deleteSheet(sheetId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();
    await Sheet.deleteOne({ _id: sheetId, userId });
    revalidatePath("/dashboard");
    return { success: true };
}

export async function updateQuestionDetails(
    sheetId: string,
    questionId: string,
    data: { title: string; url?: string; topics: string[]; difficulty: string }
) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    await Sheet.updateOne(
        { _id: sheetId, userId, "questions._id": questionId },
        {
            $set: {
                "questions.$.title": data.title,
                "questions.$.url": data.url || "", // Ensure not undefined
                "questions.$.topics": data.topics, // Ensure array
                "questions.$.difficulty": data.difficulty
            },
            $unset: { "questions.$.topic": "" } // Cleanup old field
        },
    );

    revalidatePath(`/sheet/${sheetId}`);
    return { success: true };
}

export async function addQuestion(
    sheetId: string,
    data: { title: string; url?: string; topics: string[]; difficulty: string },
    index?: number
) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    const newQuestion = {
        title: data.title,
        url: data.url || "",
        topics: data.topics,
        difficulty: data.difficulty,
        status: "PENDING",
        isBookmarked: false,
        notes: "",
    };

    const updateQuery: any = {
        $inc: { totalQuestions: 1 }
    };

    if (typeof index === 'number') {
        updateQuery.$push = {
            questions: {
                $each: [newQuestion],
                $position: index
            }
        };
    } else {
        updateQuery.$push = { questions: newQuestion };
    }

    await Sheet.updateOne(
        { _id: sheetId, userId },
        updateQuery
    );

    revalidatePath(`/sheet/${sheetId}`);
    return { success: true };
}

export async function deleteQuestion(sheetId: string, questionId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    const sheet = await Sheet.findOne({ _id: sheetId, userId });
    if (!sheet) throw new Error("Sheet not found");

    const question = sheet.questions.find((q: any) => q._id.toString() === questionId);
    if (!question) throw new Error("Question not found");

    const isSolved = question.status === "SOLVED";

    await Sheet.updateOne(
        { _id: sheetId, userId },
        {
            $pull: { questions: { _id: questionId } },
            $inc: {
                totalQuestions: -1,
                solvedQuestions: isSolved ? -1 : 0
            }
        }
    );

    revalidatePath(`/sheet/${sheetId}`);
    return { success: true };
}
