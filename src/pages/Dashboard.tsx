import { PageLayout } from "@/components/layout";
import { MatchCard } from "@/components/franchise";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Edit3, MessageCircle, Filter, ArrowUpDown, Target } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { getUserData } from "@/utils/userStorage";
import type { UserProfile } from "@/hooks/useUserProfile";

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
  const { profile, setProfile } = useUserProfile();
  const { isLoggedIn, user } = useAuth();
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  
  // Force reload profile from localStorage on mount and when navigating to this page
  // This ensures we get the latest profile data after completing onboarding
  useEffect(() => {
    if (isLoggedIn && user) {
      // Read directly from localStorage to get the latest data
      const latestProfile = getUserData<UserProfile>(user.id, 'profile', {});
      
      // Update the profile state if we have new data
      if (latestProfile && (
        (latestProfile.goals && latestProfile.goals.length > 0) ||
        latestProfile.budget ||
        (latestProfile.industries && latestProfile.industries.length > 0)
      )) {
        setProfile(latestProfile);
      }
      
      setIsCheckingProfile(false);
    } else {
      setIsCheckingProfile(false);
    }
  }, [isLoggedIn, user, setProfile]);
  
  // Check if user has completed onboarding (has profile data)
  // Profile is considered complete if it has goals, budget, or industries
  // Also check directly from localStorage for immediate updates
  const profileFromStorage = isLoggedIn && user 
    ? getUserData<UserProfile>(user.id, 'profile', {})
    : {};
  
  const hasCompletedOnboarding = isLoggedIn && !isCheckingProfile && (
    (profile.goals && profile.goals.length > 0) ||
    profile.budget ||
    (profile.industries && profile.industries.length > 0) ||
    (profileFromStorage.goals && profileFromStorage.goals.length > 0) ||
    profileFromStorage.budget ||
    (profileFromStorage.industries && profileFromStorage.industries.length > 0)
  );

  // If user hasn't completed onboarding, show empty state
  if (!hasCompletedOnboarding) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-dashed">
              <CardContent className="p-12 text-center">
                <div className="flex justify-center mb-6">
                  <div className="rounded-full bg-[#F4F8FE] p-6">
                    <Target className="w-12 h-12 text-[#446786]" />
                  </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Get Your Personalized Matches
                </h1>
                <p className="text-base text-muted-foreground mb-8 max-w-md mx-auto">
                  Take our quick 3-minute quiz to discover franchises that match your goals, budget, and lifestyle. We'll analyze your preferences and show you personalized recommendations.
                </p>
                <Link to="/onboarding">
                  <Button variant="cta" size="lg" className="text-base font-semibold px-8 py-6 rounded-[30px]">
                    Start the Quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageLayout>
    );
  }

  // User has completed onboarding - show matches
  const displayProfile = {
    name: "Alex",
    goals: profile.goals || userProfile.goals,
    budget: profile.budget || userProfile.budget,
    lifestyle: profile.lifestyle || userProfile.lifestyle,
    industries: profile.industries || userProfile.industries,
  };

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
                  {displayProfile.goals && displayProfile.goals.length > 0 && (
                    <div>
                      <p className="text-muted-foreground">Goals</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {displayProfile.goals.map((goal) => (
                          <Badge key={goal} variant="soft" className="text-xs">
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {displayProfile.budget && (
                    <div>
                      <p className="text-muted-foreground">Budget</p>
                      <p className="font-medium text-foreground">{displayProfile.budget}</p>
                    </div>
                  )}
                  {displayProfile.lifestyle && (
                    <div>
                      <p className="text-muted-foreground">Lifestyle</p>
                      <p className="font-medium text-foreground">{displayProfile.lifestyle}</p>
                    </div>
                  )}
                  {displayProfile.industries && displayProfile.industries.length > 0 && (
                    <div>
                      <p className="text-muted-foreground">Industries</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {displayProfile.industries.map((ind) => (
                          <Badge key={ind} variant="soft" className="text-xs">
                            {ind}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
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
                <h1 className="text-2xl font-bold text-foreground">Matches</h1>
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
