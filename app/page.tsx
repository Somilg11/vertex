import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, LineChart, Table, Zap } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link className="flex items-center gap-2 font-bold text-xl tracking-tighter" href="#">
            <div className="h-6 w-6 bg-zinc-900 dark:bg-white rounded-md flex items-center justify-center">
              <span className="text-white dark:text-zinc-900 text-xs">V</span>
            </div>
            Vertex
          </Link>
          <nav className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/sign-in">
              <Button variant="ghost" className="text-sm">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="text-sm bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-48 flex flex-col items-center text-center px-4 relative overflow-hidden">
          {/* Gradient Blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -z-10 opacity-50 dark:opacity-20 animate-pulse"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white/50 px-3 py-1 text-sm text-zinc-500 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              v1.0 is now live
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 pb-2">
              Master Data Structures <br className="hidden sm:block" /> with clarity.
            </h1>
            <p className="mx-auto max-w-[700px] text-zinc-500 md:text-xl dark:text-zinc-400 mb-10 leading-relaxed">
              Transformation from Excel sheets to a powerful, intelligent tracker.
              Upload your sheet, track progress, bookmark revisions, and crack your dream job.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/sign-up">
                <Button size="lg" className="h-12 px-8 text-base rounded-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-lg hover:shadow-xl transition-all">
                  Start Tracking Free
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-full backdrop-blur-sm bg-white/50 hover:bg-white/80 dark:bg-zinc-950/50 dark:hover:bg-zinc-900/80">
                  How it works
                </Button>
              </Link>
            </div>
          </div>

          {/* Abstract UI Mockup */}
          <div className="mt-20 w-full max-w-5xl mx-auto px-4 perspective-1000">
            <div className="rounded-xl border border-zinc-200 bg-white/50 dark:border-zinc-800 dark:bg-zinc-950/50 backdrop-blur-sm p-2 shadow-2xl transform rotate-x-12 transition-transform hover:rotate-x-0 duration-700 ease-out">
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950 aspect-video relative flex items-center justify-center">
                {/* Placeholder for Sheet UI if I had an image, otherwise CSS UI */}
                <div className="flex flex-col w-full h-full p-6">
                  <div className="h-8 w-1/3 bg-zinc-100 dark:bg-zinc-800 rounded-md mb-6 animate-pulse"></div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="flex items-center gap-4 h-12 border-b border-zinc-100 dark:border-zinc-900">
                        <div className="h-4 w-4 rounded bg-zinc-100 dark:bg-zinc-800"></div>
                        <div className="h-4 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800"></div>
                        <div className="ml-auto h-6 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800"></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-zinc-950 opacity-50"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="w-full py-24 bg-zinc-50/50 dark:bg-zinc-900/20 border-t border-zinc-200 dark:border-zinc-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Built for focus.</h2>
              <p className="text-zinc-500 dark:text-zinc-400">
                Everything you need to track your DSA prep, nothing you don't.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 hover:shadow-lg transition-all dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-950/30 dark:text-blue-400">
                  <Table className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Excel Import</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Drag & drop your Love Babbar or Striver sheet. We auto-detect columns and links instantly.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 hover:shadow-lg transition-all dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-500 dark:bg-green-950/30 dark:text-green-400">
                  <LineChart className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Visual Progress</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Track your solved count and completion percentage per sheet. Stay motivated visually.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 hover:shadow-lg transition-all dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-500 dark:bg-purple-950/30 dark:text-purple-400">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Revision Mode</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Mark problems for revision and add markdown notes. Perfect for last-minute interviews.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 flex justify-center">
          <div className="container px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Ready to crack that offer?</h2>
            <Link href="/sign-up">
              <Button size="lg" className="rounded-full h-12 px-8 text-base">
                Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

      </main>

      <footer className="py-8 w-full shrink-0 items-center px-4 md:px-6 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-zinc-900 dark:bg-white rounded flex items-center justify-center">
              <span className="text-white dark:text-zinc-900 text-[10px] font-bold">V</span>
            </div>
            <p className="text-sm text-zinc-500 font-medium">Vertex Tracker</p>
          </div>

          <nav className="flex gap-6">
            <Link className="text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors" href="#">
              Terms
            </Link>
            <Link className="text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors" href="#">
              Privacy
            </Link>
            <Link className="text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors" href="#">
              GitHub
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
