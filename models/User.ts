import mongoose, { Schema, Model, Document } from "mongoose";

// Mongoose adds _id, but we need it locally
export interface IQuestion {
    _id?: string;
    title: string;
    url?: string;
    topics: string[];
    difficulty: string;
    status: "PENDING" | "SOLVED" | "REVISION";
    isBookmarked: boolean;
    solvedAt?: Date;
    notes: string;
}

export interface ISheet {
    _id?: string;
    userId: string;
    title: string;
    totalQuestions: number;
    solvedQuestions: number;
    questions: IQuestion[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUser extends Document {
    clerkId: string;
    email: string;
    name?: string;
}

// Subdocument schema for Questions
const QuestionSchema = new Schema({
    title: { type: String, required: true },
    url: { type: String, required: false },
    topics: { type: [String], default: [] },
    difficulty: { type: String, required: true },
    status: { type: String, enum: ["PENDING", "SOLVED"], default: "PENDING" },
    isBookmarked: { type: Boolean, default: false },
    solvedAt: { type: Date },
    notes: { type: String, default: "" },
});

// Sheet Schema
const SheetSchema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        title: { type: String, required: true },
        totalQuestions: { type: Number, default: 0 },
        solvedQuestions: { type: Number, default: 0 },
        questions: [QuestionSchema],
    },
    { timestamps: true },
);

// User Schema
const UserSchema = new Schema(
    {
        clerkId: { type: String, required: true, unique: true },
        email: { type: String, required: true },
        name: { type: String },
    },
    { timestamps: true },
);

// Prevent overwriting models during hot reload
export const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export const Sheet: Model<ISheet & Document> =
    mongoose.models.Sheet || mongoose.model<ISheet & Document>("Sheet", SheetSchema);
