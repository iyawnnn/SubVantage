import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Wallet, 
  Bell, 
  ShieldCheck, 
  ArrowRight 
} from "lucide-react";
import { SignInButton } from "@/components/auth/SignInButton"; // We will fix this next

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-1">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">SubTrack</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="container mx-auto px-4 py-24 text-center sm:py-32">
          <Badge variant="secondary" className="mb-4 text-primary">
            v2.0 is now live
          </Badge>
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl">
            Stop paying for <br />
            <span className="text-primary">forgotten subscriptions.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Track, manage, and cancel your recurring expenses in one beautiful dashboard. 
            Get alerts before you get charged.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <SignInButton />
            <Link href="#features">
              <Button variant="outline" size="lg">
                Learn more
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid (Replaces SimpleGrid) */}
        <section id="features" className="container mx-auto px-4 py-24">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FeatureCard 
              icon={<BarChart3 className="h-8 w-8 text-primary" />}
              title="Visual Insights"
              description="See exactly where your money goes with beautiful, interactive charts and spending breakdowns."
            />
            <FeatureCard 
              icon={<Bell className="h-8 w-8 text-primary" />}
              title="Smart Alerts"
              description="Get notified days before a renewal happens so you never pay for an unwanted service again."
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-8 w-8 text-primary" />}
              title="Bank Level Security"
              description="Your data is encrypted and secure. We never sell your personal financial information."
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SubTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="border-border/50 bg-card/50 transition-colors hover:bg-card">
      <CardHeader>
        <div className="mb-4 inline-flex w-fit rounded-lg bg-primary/10 p-3 ring-1 ring-inset ring-primary/20">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}