import { PageLayout } from "@/components/layout";
import { MatchCard } from "@/components/franchise";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Edit3, MessageCircle, Filter, ArrowUpDown } from "lucide-react";

const userProfile = {
  name: "Alex",
  goals: ["Financial freedom", "Be my own boss"],
  budget: "$100K – $250K",
  lifestyle: "Full-time",
  industries: ["Food & Beverage", "Health & Fitness"],
};

const matches = [
  {
    id: "subway-1",
    name: "Subway",
    grade: "A" as const,
    whyYes: [
      "Aligns with your food & beverage interest",
      "Investment fits your budget range",
      "Strong training program for new owners",
    ],
    whyNot: ["High competition in quick-service", "Requires full-time commitment"],
    fitChips: { territory: true, lifestyle: true, budget: true },
  },
  {
    id: "orangetheory-1",
    name: "Orangetheory Fitness",
    grade: "B" as const,
    whyYes: [
      "Matches your health & fitness interest",
      "Growing market demand",
      "Semi-absentee ownership possible",
    ],
    whyNot: ["Investment exceeds budget", "Limited territories available"],
    fitChips: { territory: false, lifestyle: true, budget: false },
  },
  {
    id: "jerseymikes-1",
    name: "Jersey Mike's Subs",
    grade: "B" as const,
    whyYes: [
      "Strong brand in food & beverage",
      "Excellent franchisee support",
      "Proven business model",
    ],
    whyNot: ["Investment at top of budget", "Saturated markets in some areas"],
    fitChips: { territory: true, lifestyle: true, budget: true },
  },
  {
    id: "mathnasium-1",
    name: "Mathnasium",
    grade: "C" as const,
    whyYes: ["Lower investment requirement", "Flexible schedule possible"],
    whyNot: [
      "Not in your preferred industries",
      "Requires education background preferred",
      "Lower revenue potential",
    ],
    fitChips: { territory: true, lifestyle: false, budget: true },
  },
];

export default function Dashboard() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-foreground">Your Profile</h2>
                  <Link to="/onboarding">
                    <Button variant="ghost" size="icon">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Goals</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {userProfile.goals.map((goal) => (
                        <Badge key={goal} variant="soft" className="text-xs">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <p className="font-medium text-foreground">{userProfile.budget}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Lifestyle</p>
                    <p className="font-medium text-foreground">{userProfile.lifestyle}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Industries</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {userProfile.industries.map((ind) => (
                        <Badge key={ind} variant="soft" className="text-xs">
                          {ind}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advisor CTA */}
            <Card className="bg-secondary text-secondary-foreground">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Need guidance?</h3>
                <p className="text-sm text-secondary-foreground/70 mb-4">
                  Talk to a franchise advisor to discuss your matches.
                </p>
                <Button variant="cta" className="w-full">
                  Talk to Advisor
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Your Matches</h1>
                <p className="text-muted-foreground">
                  Based on your profile, we found <span className="font-medium">{matches.length}</span> strong matches
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  Sort
                </Button>
              </div>
            </div>

            {/* Match List */}
            <div className="space-y-4">
              {matches.map((match, i) => (
                <div key={match.id} className="animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <MatchCard {...match} />
                </div>
              ))}
            </div>

            {/* Compare CTA */}
            <Card className="mt-8 border-dashed">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-foreground mb-2">Ready to compare?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select up to 4 franchises to compare side-by-side
                </p>
                <Link to="/compare">
                  <Button variant="navy">Open Comparison Tool</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
