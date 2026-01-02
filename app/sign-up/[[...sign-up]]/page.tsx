import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            <div className="z-10">
                <SignUp appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "bg-white dark:bg-black shadow-none border border-gray-200 dark:border-gray-800",
                    }
                }} />
            </div>
        </div>
    );
}
