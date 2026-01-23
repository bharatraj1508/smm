import {
  ArrowRight,
  CheckCircle2,
  Zap,
  Brain,
  FileText,
  Clock,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Zap className="size-5" />
            </div>
            <span>InboxIQ</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="hidden sm:inline-flex">
                Log in
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button>
                Get Started <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-16 md:pb-24">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-full -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-70" />

          <div className="container mx-auto px-4 md:px-8 text-center">
            <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground mb-8 backdrop-blur-sm">
              <span className="flex size-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              New: AI-Powered Email Intelligence
            </div>

            <h1 className="mx-auto max-w-4xl text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
              Tame Your Inbox with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                AI Summaries
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              Automatically summarize long threads, prioritize important emails,
              and clear the clutter. reclaim your time and focus on what
              matters.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base shadow-lg shadow-primary/20"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm"
                >
                  View Demo
                </Button>
              </Link>
            </div>

            {/* Hero Image / Dashboard Preview */}
            <div className="mt-16 sm:mt-24 relative mx-auto max-w-5xl rounded-xl border bg-background/50 p-2 shadow-2xl backdrop-blur-sm ring-1 ring-border/50 lg:rounded-2xl lg:p-4">
              <div className="aspect-[16/9] overflow-hidden rounded-lg border bg-muted/20 flex items-center justify-center relative">
                {/* Create a visual representation of a dashboard with pure CSS/HTML structures if no image is available */}
                <div className="flex flex-col items-center gap-4 p-8 text-muted-foreground">
                  <img
                    src="/dashboard.png"
                    alt="Dashboard Preview"
                    className="w-full h-full object-contain"
                  />
                  <p className="font-medium">AI-Powered Inbox Interface</p>
                </div>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Focus on what matters
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful AI tools designed to help you breeze through your
                inbox, catch key details, and never miss an important message.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-background border-border/50 shadow-sm transition-all hover:shadow-md">
                <CardHeader>
                  <div className="size-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 mb-4">
                    <FileText className="size-6" />
                  </div>
                  <CardTitle>Instant Summaries</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Turn long, complex email threads into concise bullet points.
                    Get the context you need in seconds without reading every
                    word.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-background border-border/50 shadow-sm transition-all hover:shadow-md">
                <CardHeader>
                  <div className="size-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 mb-4">
                    <Brain className="size-6" />
                  </div>
                  <CardTitle>Smart Prioritization</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Our AI learns what&apos;s important to you. Automatically
                    categorize newsletters, notifications, and critical
                    messages.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-background border-border/50 shadow-sm transition-all hover:shadow-md">
                <CardHeader>
                  <div className="size-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 mb-4">
                    <Clock className="size-6" />
                  </div>
                  <CardTitle>Daily Briefings</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Start your day with a digested overview of everything that
                    happened while you were away. Stay in the loop with zero
                    stress.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                  Zero to Inbox Zero in minutes
                </h2>
                <p className="text-xl text-muted-foreground mb-10">
                  Our streamlined workflow removes the noise from your email,
                  letting you focus on replies and actions.
                </p>

                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="flex-none">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                        1
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Connect Your Email
                      </h3>
                      <p className="text-muted-foreground">
                        Securely link your Gmail or Outlook account with just a
                        few clicks.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-none">
                      <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground font-bold text-lg border">
                        2
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        AI Analysis
                      </h3>
                      <p className="text-muted-foreground">
                        Our AI instantly scans your inbox to identify important
                        threads and summaries.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-none">
                      <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground font-bold text-lg border">
                        3
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Read Less, Do More
                      </h3>
                      <p className="text-muted-foreground">
                        Review concise logic-based summaries and take action
                        immediately.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 w-full">
                <div className="relative rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-purple-500/5 p-8 border border-primary/10">
                  <div className="bg-background rounded-xl shadow-xl p-6 border space-y-4">
                    <div className="flex items-center gap-3 border-b pb-4">
                      <div className="size-10 rounded-full bg-muted animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/3 bg-muted rounded animate-pulse"></div>
                        <div className="h-3 w-1/4 bg-muted/60 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="h-32 bg-muted/20 rounded-lg w-full flex items-center justify-center border border-dashed">
                      <CheckCircle2 className="size-8 text-muted-foreground/30" />
                    </div>
                    <div className="flex justify-between pt-2">
                      <div className="h-8 w-24 bg-primary/10 rounded"></div>
                      <div className="h-8 w-24 bg-primary rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Simple Social Proof */}
        <section className="py-16 bg-muted/50 border-y border-border/50">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-8">
              Trusted by forward-thinking teams
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale transition-all hover:grayscale-0 hover:opacity-100 duration-500">
              {/* Placeholders for logos */}
              <div className="flex items-center font-black text-xl gap-2">
                <div className="size-6 bg-foreground rounded-full"></div> ACME
                Corp
              </div>
              <div className="flex items-center font-black text-xl gap-2">
                <div className="size-6 bg-foreground rounded-md rotate-45"></div>{" "}
                Z-Tech
              </div>
              <div className="flex items-center font-black text-xl gap-2">
                <div className="size-6 bg-foreground rounded-t-xl"></div> Globex
              </div>
              <div className="flex items-center font-black text-xl gap-2">
                <div className="size-6 bg-foreground rounded-r-lg"></div> Stark
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-primary/5"></div>
          <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Ready to clear your inbox?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Join thousands of professionals who save hours every week with
              AI-powered summaries. Get started for free today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="h-14 px-10 text-lg rounded-full shadow-xl shadow-primary/20"
                >
                  Get Started Now
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-4 sm:mt-0 sm:ml-4 flex items-center">
                <CheckCircle2 className="size-4 mr-2 text-green-500" /> No
                credit card required
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <div className="flex size-6 items-center justify-center rounded bg-primary/20 text-primary">
                  <Zap className="size-4" />
                </div>
                InboxIQ
              </div>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                Empowering teams to stay on top of their communications with
                intelligent email summarization.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy-policy" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} InboxIQ. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
