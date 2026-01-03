import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, LineChart, Table, Zap, Github, Coffee, Mail } from "lucide-react";
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
        <section id="features" className="w-full py-24 border-t border-zinc-200 dark:border-zinc-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col h-full rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950/50">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    01
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Import your sheets</h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 flex-1">
                  Upload Excel or CSV files from Love Babbar, Striver, or your own collection. We auto-detect links and structure alone.
                </p>
                {/* Mockup 1: Import */}
                <div className="relative w-full h-40 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800 overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:8px_8px] opacity-50"></div>
                  <div className="relative z-10 bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-green-100 flex items-center justify-center text-green-600 dark:bg-green-900/30 dark:text-green-400">
                      <Table className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="h-2 w-20 bg-zinc-200 dark:bg-zinc-600 rounded mb-1"></div>
                      <div className="h-2 w-12 bg-zinc-100 dark:bg-zinc-700 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col h-full rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950/50">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    02
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Track progress visually</h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 flex-1">
                  See your consistency with beautiful heatmaps and progress bars. Stay motivated as you turn tiles green.
                </p>
                {/* Mockup 2: Heatmap */}
                <div className="relative w-full h-40 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800 overflow-hidden flex items-center justify-center px-6">
                  <div className="grid grid-cols-7 gap-1 w-full">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div key={i} className={`h-2 rounded-[1px] ${[1, 2, 5, 8, 12, 15, 20, 22, 25].includes(i) ? 'bg-green-500' : 'bg-zinc-200 dark:bg-zinc-800'}`}></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col h-full rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950/50">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    03
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Revise & Conquer</h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 flex-1">
                  Bookmark tricky problems and add notes for last-minute revision before your interview.
                </p>
                {/* Mockup 3: Revision */}
                <div className="relative w-full h-40 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800 overflow-hidden flex flex-col p-4 gap-2">
                  <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4"></div>
                  <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded w-full"></div>
                  <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded w-5/6"></div>
                  <div className="mt-auto flex gap-2">
                    <div className="h-4 w-12 rounded-full bg-yellow-100 text-[8px] flex items-center justify-center text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 font-medium">Revision</div>
                    <div className="h-4 w-12 rounded-full bg-blue-100 text-[8px] flex items-center justify-center text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">Notes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 px-4">
          <div className="container mx-auto">
            <div className="relative rounded-3xl overflow-hidden bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-20 text-center sm:px-12 lg:px-20">
              {/* Mesh Gradient */}
              <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-800/50 to-transparent dark:from-zinc-200/50"></div>
              <h2 className="relative text-3xl sm:text-4xl font-bold tracking-tight mb-6">
                Ready to land your dream job?
              </h2>
              <p className="relative text-zinc-300 dark:text-zinc-600 max-w-xl mx-auto mb-10 text-lg">
                Join thousands of developers tracking their DSA preparation with Vertex. Start for free today.
              </p>
              <div className="relative flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up">
                  <Button size="lg" className="rounded-full h-14 px-8 text-base bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 border-0">
                    Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="py-8 w-full shrink-0 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-zinc-900 dark:bg-white rounded flex items-center justify-center">
              <span className="text-white dark:text-zinc-900 text-xs font-bold">V</span>
            </div>
            <span className="font-bold text-lg">Vertex</span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <Link
              href="https://gsomil.vercel.app"
              target="_blank"
              className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              Developed by Somil
            </Link>
            <Link
              href="https://github.com/Somilg11/vertex"
              target="_blank"
              className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">Source</span>
            </Link>
            <Link
              href="https://buymeacoffee.com/gsomil"
              target="_blank"
              className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors flex items-center gap-2"
            >
              <Coffee className="h-4 w-4" />
              <span className="hidden sm:inline">Donate</span>
            </Link>
            <Link
              href="mailto:gsomil93@gmail.com"
              className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Contact</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
