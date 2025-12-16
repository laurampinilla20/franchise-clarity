import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Target,
  GitCompare,
  MapPin,
  Route,
  MessageCircle,
  Shield,
  Sparkles,
  Users,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Investor-First Matching",
    description:
      "Our algorithm puts your goals first, analyzing 50+ factors to find franchises that truly fit your life.",
  },
  {
    icon: GitCompare,
    title: "Clear Comparisons",
    description:
      "Side-by-side analysis of investment, profitability, territory, and lifestyle factors.",
  },
  {
    icon: MapPin,
    title: "Territory Validation",
    description:
      "Real-time territory availability checks so you know exactly where you can operate.",
  },
  {
    icon: Route,
    title: "Guided Journey",
    description:
      "Step-by-step guidance from curiosity to commitment, with expert support at every stage.",
  },
];

const advisors = [
  {
    name: "Sarah Chen",
    role: "Senior Franchise Advisor",
    specialties: ["Food & Beverage", "Multi-Unit"],
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Marcus Johnson",
    role: "Investment Specialist",
    specialties: ["Healthcare", "Senior Care"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Elena Rodriguez",
    role: "Franchise Consultant",
    specialties: ["Retail", "Home Services"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
  },
];

const steps = [
  {
    number: "01",
    title: "Build Your Profile",
    description: "Answer a few questions about your goals, lifestyle, and investment capacity.",
  },
  {
    number: "02",
    title: "Get Matched",
    description: "Our algorithm analyzes 500+ franchises to find your best fits.",
  },
  {
    number: "03",
    title: "Compare & Decide",
    description: "Use our tools to compare options and understand the trade-offs.",
  },
  {
    number: "04",
    title: "Connect & Commit",
    description: "Work with an advisor to validate your choice and start your journey.",
  },
];

export default function Index() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="info" className="mb-6 animate-fade-in">
              <Sparkles className="w-3 h-3 mr-1" />
              Investor-First Platform
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight animate-fade-up">
              Find the franchise that
              <span className="text-primary"> truly fits you</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "100ms" }}>
              Your profile. Your goals. Your match. We guide you from curiosity to clarity to commitment.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "200ms" }}>
              <Link to="/onboarding">
                <Button variant="cta" size="xl">
                  Find Your Best Match
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/best-franchises">
                <Button variant="navy-outline" size="xl">
                  Explore Franchises
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>No sales pressure</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>10,000+ investors helped</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Built for investors, not brands
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlike other portals, we're designed around your success—not franchise sales quotas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card key={feature.title} className="border-transparent bg-muted/50 hover:bg-muted transition-colors" style={{ animationDelay: `${i * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Your path to ownership
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              A structured journey from exploration to decision, with support at every step.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-border -translate-x-4" />
                )}
                <div className="text-5xl font-bold text-primary/20 mb-4">{step.number}</div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Cards Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Smart Match Card */}
            <Card className="overflow-hidden">
              <div className="h-2 bg-primary" />
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg text-foreground mb-4">Smart Match Grades</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">A</div>
                    <div>
                      <div className="font-medium text-foreground">Excellent Match</div>
                      <div className="text-xs text-muted-foreground">Territory, lifestyle, budget aligned</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <div className="w-10 h-10 rounded-full bg-sky-light text-navy font-bold flex items-center justify-center">B</div>
                    <div>
                      <div className="font-medium text-foreground">Good Match</div>
                      <div className="text-xs text-muted-foreground">Minor considerations to review</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comparison Preview */}
            <Card className="overflow-hidden">
              <div className="h-2 bg-navy" />
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg text-foreground mb-4">Side-by-Side Comparison</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Investment</span>
                    <span className="font-medium">$50K – $500K</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Avg. Revenue</span>
                    <span className="font-medium">$450K/yr</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Lifestyle Fit</span>
                    <Badge variant="success" className="text-xs">Full-time</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Journey Preview */}
            <Card className="overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary to-navy" />
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg text-foreground mb-4">Ownership Journey</h3>
                <div className="space-y-3">
                  {["Discovery Call", "Due Diligence", "Signing Day"].map((step, i) => (
                    <div key={step} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {i === 0 ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                      </div>
                      <span className={i === 0 ? "font-medium text-foreground" : "text-muted-foreground"}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advisors Section */}
      <section id="advisors" className="py-24 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Expert advisors by your side
            </h2>
            <p className="mt-4 text-lg text-secondary-foreground/70 max-w-2xl mx-auto">
              Our franchise experts have helped thousands of investors find their perfect match.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {advisors.map((advisor) => (
              <Card key={advisor.name} className="bg-secondary-foreground/5 border-secondary-foreground/10 text-secondary-foreground">
                <CardContent className="p-6 text-center">
                  <img
                    src={advisor.image}
                    alt={advisor.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-semibold">{advisor.name}</h3>
                  <p className="text-sm text-secondary-foreground/70 mb-3">{advisor.role}</p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {advisor.specialties.map((s) => (
                      <Badge key={s} variant="outline" className="text-xs border-secondary-foreground/20 text-secondary-foreground/80">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/onboarding">
              <Button variant="cta" size="lg">
                <MessageCircle className="w-4 h-4" />
                Talk to an Advisor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to find your match?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Take 5 minutes to build your profile and discover franchises that fit your life.
            </p>
            <div className="mt-8">
              <Link to="/onboarding">
                <Button variant="cta" size="xl">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
