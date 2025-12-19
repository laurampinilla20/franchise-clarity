import { PageLayout } from "@/components/layout";
import { MatchCard } from "@/components/franchise";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Heart, Filter, ArrowUpDown, Trash2 } from "lucide-react";
import { useState } from "react";

const savedFranchises = [
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
];

export default function Saved() {
  const [savedItems, setSavedItems] = useState(savedFranchises);

  const handleRemove = (id: string) => {
    setSavedItems(savedItems.filter((item) => item.id !== id));
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Heart className="w-8 h-8 text-primary" />
                Saved Franchises
              </h1>
              <p className="text-muted-foreground mt-1">
                {savedItems.length} {savedItems.length === 1 ? "franchise" : "franchises"} saved
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowUpDown className="w-4 h-4" />
                Sort
              </Button>
            </div>
          </div>

          {savedItems.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No saved franchises yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start exploring franchises and save the ones you're interested in.
                </p>
                <Link to="/best-franchises">
                  <Button variant="cta">Browse Franchises</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Saved Franchises List */}
              <div className="space-y-4">
                {savedItems.map((franchise, i) => (
                  <div
                    key={franchise.id}
                    className="relative animate-fade-up"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemove(franchise.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <MatchCard {...franchise} />
                  </div>
                ))}
              </div>

              {/* Compare CTA */}
              {savedItems.length > 1 && (
                <Card className="mt-8 border-dashed">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-foreground mb-2">
                      Ready to compare your saved franchises?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select up to 4 franchises to compare side-by-side
                    </p>
                    <Link to="/compare">
                      <Button variant="navy">Open Comparison Tool</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}


