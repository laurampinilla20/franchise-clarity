import { PageLayout } from "@/components/layout";
import { GradeBadge } from "@/components/franchise";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useParams, Link } from "react-router-dom";
import {
  Heart,
  GitCompare,
  MessageCircle,
  Lock,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Building2,
} from "lucide-react";

const brandData = {
  id: "subway-1",
  name: "Subway",
  tagline: "Eat Fresh",
  description: "Subway is the world's largest submarine sandwich franchise, with more than 37,000 locations in over 100 countries.",
  logo: null,
  grade: "B" as const,
  sector: "Food & Beverage",
  category: "Quick Service",
  investment: {
    min: 150000,
    max: 350000,
    franchiseFee: 15000,
    royalty: "8%",
    marketing: "4.5%",
  },
  profitability: {
    avgRevenue: 450000,
    avgProfit: 75000,
    breakeven: "18-24 months",
  },
  lifestyle: {
    timeCommitment: "Full-time",
    travelRequired: "Minimal",
    managementStyle: "Owner-operator or Manager-run",
  },
  requirements: {
    netWorth: 100000,
    liquidCapital: 50000,
    experience: "Food service preferred but not required",
    creditScore: 680,
  },
  territories: {
    available: ["California", "Texas", "Florida", "New York"],
    limited: ["Colorado", "Arizona"],
    unavailable: ["Washington", "Oregon"],
  },
  whyYes: [
    "Strong brand recognition worldwide",
    "Flexible store formats available",
    "Comprehensive training program",
    "Lower investment than competitors",
  ],
  whyNot: [
    "Saturated markets in some areas",
    "High ongoing royalty fees",
    "Competitive quick-service landscape",
  ],
  faqs: [
    {
      question: "What training is provided?",
      answer: "Subway provides a comprehensive 2-week training program covering operations, marketing, and business management.",
    },
    {
      question: "Can I own multiple locations?",
      answer: "Yes, Subway encourages multi-unit ownership and offers incentives for expansion.",
    },
  ],
};

export default function BrandDetail() {
  const { slug } = useParams();
  const isLoggedIn = false;
  const brand = brandData;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <PageLayout>
      <div className="bg-muted/30">
        {/* Header */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Logo */}
            <div className="w-24 h-24 rounded-2xl bg-background shadow-card flex items-center justify-center flex-shrink-0">
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <Building2 className="w-12 h-12 text-muted-foreground" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{brand.name}</h1>
                  <p className="text-muted-foreground mt-1">{brand.tagline}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="chip">{brand.sector}</Badge>
                    <Badge variant="chip">{brand.category}</Badge>
                  </div>
                </div>

                {isLoggedIn ? (
                  <GradeBadge grade={brand.grade} size="lg" showLabel />
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Sign in for grade</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="icon" size="icon">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="icon" size="icon">
                <GitCompare className="w-4 h-4" />
              </Button>
              <Link to="/onboarding">
                <Button variant="navy" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Talk to Advisor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="snapshot" className="space-y-8">
          <TabsList className="w-full md:w-auto overflow-x-auto">
            <TabsTrigger value="snapshot">Snapshot</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
            <TabsTrigger value="profitability">Profitability</TabsTrigger>
            <TabsTrigger value="territories">Territories</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="fit">Why Yes / No</TabsTrigger>
          </TabsList>

          {/* Snapshot Tab */}
          <TabsContent value="snapshot">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">About {brand.name}</h3>
                    <p className="text-muted-foreground">{brand.description}</p>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <Card className="bg-muted/50 border-transparent">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Investment</p>
                          <p className="font-semibold text-foreground">
                            {formatCurrency(brand.investment.min)}+
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50 border-transparent">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Avg. Revenue</p>
                          <p className="font-semibold text-foreground">
                            {formatCurrency(brand.profitability.avgRevenue)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50 border-transparent">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Lifestyle</p>
                          <p className="font-semibold text-foreground">{brand.lifestyle.timeCommitment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {!isLoggedIn && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-6 text-center">
                      <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
                      <h4 className="font-semibold text-foreground mb-2">Unlock Full Details</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Sign in to see your personalized match grade and detailed analysis.
                      </p>
                      <Link to="/onboarding">
                        <Button variant="cta" className="w-full">
                          Get Started
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground mb-4">Quick Facts</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Franchise Fee</span>
                        <span className="font-medium">{formatCurrency(brand.investment.franchiseFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Royalty</span>
                        <span className="font-medium">{brand.investment.royalty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Marketing Fee</span>
                        <span className="font-medium">{brand.investment.marketing}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Investment Tab */}
          <TabsContent value="investment">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-6">Investment Breakdown</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Total Investment Range</span>
                      <span className="font-semibold">
                        {formatCurrency(brand.investment.min)} – {formatCurrency(brand.investment.max)}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Franchise Fee</span>
                      <span className="font-semibold">{formatCurrency(brand.investment.franchiseFee)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Ongoing Royalty</span>
                      <span className="font-semibold">{brand.investment.royalty}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground">Marketing Fee</span>
                      <span className="font-semibold">{brand.investment.marketing}</span>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-muted/50">
                    <h4 className="font-medium text-foreground mb-3">What's Included</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Initial training program
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Site selection assistance
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Marketing materials
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Ongoing support
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profitability Tab */}
          <TabsContent value="profitability">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-6">Profitability Insights</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                    <TrendingUp className="w-8 h-8 text-primary mb-3" />
                    <p className="text-sm text-muted-foreground">Average Revenue</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(brand.profitability.avgRevenue)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">per year</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-muted/50">
                    <DollarSign className="w-8 h-8 text-navy mb-3" />
                    <p className="text-sm text-muted-foreground">Average Profit</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(brand.profitability.avgProfit)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">per year</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-muted/50">
                    <Clock className="w-8 h-8 text-navy mb-3" />
                    <p className="text-sm text-muted-foreground">Breakeven</p>
                    <p className="text-2xl font-bold text-foreground">{brand.profitability.breakeven}</p>
                    <p className="text-xs text-muted-foreground mt-1">typical timeline</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Territories Tab */}
          <TabsContent value="territories">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-6">Territory Availability</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="flex items-center gap-2 font-medium text-foreground mb-3">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Available
                    </h4>
                    <ul className="space-y-2">
                      {brand.territories.available.map((t) => (
                        <li key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 font-medium text-foreground mb-3">
                      <Clock className="w-4 h-4 text-amber-500" />
                      Limited
                    </h4>
                    <ul className="space-y-2">
                      {brand.territories.limited.map((t) => (
                        <li key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 font-medium text-foreground mb-3">
                      <XCircle className="w-4 h-4 text-rose-500" />
                      Unavailable
                    </h4>
                    <ul className="space-y-2">
                      {brand.territories.unavailable.map((t) => (
                        <li key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requirements Tab */}
          <TabsContent value="requirements">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-6">Candidate Requirements</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Minimum Net Worth</span>
                      <span className="font-semibold">{formatCurrency(brand.requirements.netWorth)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Liquid Capital Required</span>
                      <span className="font-semibold">{formatCurrency(brand.requirements.liquidCapital)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Credit Score</span>
                      <span className="font-semibold">{brand.requirements.creditScore}+</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground">Experience</span>
                      <span className="font-semibold text-right max-w-[200px]">{brand.requirements.experience}</span>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-muted/50">
                    <Users className="w-8 h-8 text-navy mb-3" />
                    <h4 className="font-medium text-foreground mb-2">Ideal Candidate</h4>
                    <p className="text-sm text-muted-foreground">
                      {brand.name} looks for motivated individuals with strong leadership skills and a passion for customer service. Prior food service experience is helpful but not required.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Why Yes / No Tab */}
          <TabsContent value="fit">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-primary/20">
                <CardContent className="p-6">
                  <h3 className="flex items-center gap-2 font-semibold text-foreground mb-4">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    Why Yes
                  </h3>
                  <ul className="space-y-3">
                    {brand.whyYes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-rose-200">
                <CardContent className="p-6">
                  <h3 className="flex items-center gap-2 font-semibold text-foreground mb-4">
                    <XCircle className="w-5 h-5 text-rose-500" />
                    Why Not
                  </h3>
                  <ul className="space-y-3">
                    {brand.whyNot.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
