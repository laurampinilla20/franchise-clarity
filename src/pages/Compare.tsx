import { PageLayout } from "@/components/layout";
import { GradeBadge } from "@/components/franchise";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  X,
  CheckCircle2,
  XCircle,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  Users,
  MessageCircle,
} from "lucide-react";

const compareData = [
  {
    id: "subway-1",
    name: "Subway",
    grade: "A" as const,
    investment: { min: 150000, max: 350000 },
    avgRevenue: 450000,
    avgProfit: 75000,
    royalty: "8%",
    lifestyle: "Full-time",
    territory: "Available",
    candidateFit: "Strong",
    whyYes: ["Strong brand", "Lower investment", "Great training"],
    whyNot: ["High competition", "Saturated markets"],
  },
  {
    id: "jerseymikes-1",
    name: "Jersey Mike's",
    grade: "B" as const,
    investment: { min: 200000, max: 700000 },
    avgRevenue: 550000,
    avgProfit: 95000,
    royalty: "6.5%",
    lifestyle: "Full-time",
    territory: "Limited",
    candidateFit: "Good",
    whyYes: ["Higher revenue", "Growing brand", "Good support"],
    whyNot: ["Higher investment", "Limited territories"],
  },
  {
    id: "orangetheory-1",
    name: "Orangetheory",
    grade: "B" as const,
    investment: { min: 500000, max: 1000000 },
    avgRevenue: 850000,
    avgProfit: 180000,
    royalty: "8%",
    lifestyle: "Semi-absentee",
    territory: "Limited",
    candidateFit: "Moderate",
    whyYes: ["High revenue", "Recurring membership", "Growing market"],
    whyNot: ["High investment", "Complex operations"],
  },
];

export default function Compare() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Compare Franchises</h1>
            <p className="text-muted-foreground">
              Side-by-side comparison of your selected franchises
            </p>
          </div>
          <Button variant="cta" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            Discuss with Advisor
          </Button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Franchise Headers */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="font-medium text-muted-foreground">Franchise</div>
              {compareData.map((franchise) => (
                <Card key={franchise.id} className="relative">
                  <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-xl bg-muted mx-auto mb-3 flex items-center justify-center">
                      <span className="text-lg font-bold text-muted-foreground">
                        {franchise.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground">{franchise.name}</h3>
                    <div className="mt-2 flex justify-center">
                      <GradeBadge grade={franchise.grade} size="md" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Comparison Rows */}
            <div className="space-y-4">
              {/* Investment */}
              <div className="grid grid-cols-4 gap-4 items-center py-4 border-b border-border">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  Investment
                </div>
                {compareData.map((f) => (
                  <div key={f.id} className="text-center">
                    <span className="font-semibold text-foreground">
                      {formatCurrency(f.investment.min)} – {formatCurrency(f.investment.max)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Revenue */}
              <div className="grid grid-cols-4 gap-4 items-center py-4 border-b border-border">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  Avg. Revenue
                </div>
                {compareData.map((f) => (
                  <div key={f.id} className="text-center">
                    <span className="font-semibold text-foreground">{formatCurrency(f.avgRevenue)}</span>
                  </div>
                ))}
              </div>

              {/* Profit */}
              <div className="grid grid-cols-4 gap-4 items-center py-4 border-b border-border">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  Avg. Profit
                </div>
                {compareData.map((f) => (
                  <div key={f.id} className="text-center">
                    <span className="font-semibold text-primary">{formatCurrency(f.avgProfit)}</span>
                  </div>
                ))}
              </div>

              {/* Royalty */}
              <div className="grid grid-cols-4 gap-4 items-center py-4 border-b border-border">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  Royalty Fee
                </div>
                {compareData.map((f) => (
                  <div key={f.id} className="text-center">
                    <span className="font-medium text-foreground">{f.royalty}</span>
                  </div>
                ))}
              </div>

              {/* Lifestyle */}
              <div className="grid grid-cols-4 gap-4 items-center py-4 border-b border-border">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Lifestyle
                </div>
                {compareData.map((f) => (
                  <div key={f.id} className="text-center">
                    <Badge variant="soft">{f.lifestyle}</Badge>
                  </div>
                ))}
              </div>

              {/* Territory */}
              <div className="grid grid-cols-4 gap-4 items-center py-4 border-b border-border">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  Territory
                </div>
                {compareData.map((f) => (
                  <div key={f.id} className="text-center">
                    <Badge variant={f.territory === "Available" ? "success" : "warning"}>
                      {f.territory}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Candidate Fit */}
              <div className="grid grid-cols-4 gap-4 items-center py-4 border-b border-border">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Users className="w-4 h-4" />
                  Candidate Fit
                </div>
                {compareData.map((f) => (
                  <div key={f.id} className="text-center">
                    <Badge
                      variant={
                        f.candidateFit === "Strong"
                          ? "success"
                          : f.candidateFit === "Good"
                          ? "info"
                          : "soft"
                      }
                    >
                      {f.candidateFit}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Why Yes */}
              <div className="grid grid-cols-4 gap-4 py-4 border-b border-border">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Why Yes
                </div>
                {compareData.map((f) => (
                  <div key={f.id}>
                    <ul className="space-y-1">
                      {f.whyYes.map((item, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                          <span className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Why Not */}
              <div className="grid grid-cols-4 gap-4 py-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  Why Not
                </div>
                {compareData.map((f) => (
                  <div key={f.id}>
                    <ul className="space-y-1">
                      {f.whyNot.map((item, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                          <span className="w-1 h-1 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Card className="mt-8">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">Made your decision?</h3>
            <p className="text-muted-foreground mb-6">
              Pick 1-2 franchises and talk to an advisor to take the next step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="cta" size="lg" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Talk to an Advisor
              </Button>
              <Link to="/ownership-path">
                <Button variant="navy-outline" size="lg">
                  View Ownership Path
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
