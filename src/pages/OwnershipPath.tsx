import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Lock,
  CheckCircle2,
  Circle,
  MessageCircle,
  Phone,
  FileText,
  Users,
  PenTool,
  Rocket,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
type StepStatus = "locked" | "current" | "completed";

const steps: Array<{
  id: number;
  title: string;
  description: string;
  icon: typeof Phone;
  status: StepStatus;
  takeaways: string[];
  actions: string[];
}> = [
  {
    id: 1,
    title: "Discovery Call",
    description: "Initial conversation with a franchise advisor to discuss your profile and interests.",
    icon: Phone,
    status: "locked",
    takeaways: ["Confirm your top franchise choices", "Understand the discovery process", "Set expectations and timeline"],
    actions: ["Schedule 30-min call", "Review brand materials"],
  },
  {
    id: 2,
    title: "Franchisor Meet & Greet",
    description: "Virtual or in-person meeting with franchise development team.",
    icon: Users,
    status: "locked",
    takeaways: ["Learn about franchise culture", "Ask detailed questions", "Evaluate franchisor support"],
    actions: ["Prepare questions", "Review FDD summary"],
  },
  {
    id: 3,
    title: "Due Diligence",
    description: "Deep dive into financials, speak with existing franchisees.",
    icon: FileText,
    status: "locked",
    takeaways: ["Validate financial projections", "Understand day-to-day operations", "Assess territory potential"],
    actions: ["Review Item 19", "Contact 3-5 franchisees", "Visit locations"],
  },
  {
    id: 4,
    title: "Discovery Day",
    description: "Visit headquarters, meet the team, and experience the brand.",
    icon: Rocket,
    status: "locked",
    takeaways: ["Experience corporate culture", "Meet leadership team", "Tour operations"],
    actions: ["Book travel", "Prepare final questions"],
  },
  {
    id: 5,
    title: "Signing Day",
    description: "Review and sign franchise agreement. You're officially a franchisee!",
    icon: PenTool,
    status: "locked",
    takeaways: ["Complete legal review", "Secure financing", "Sign franchise agreement"],
    actions: ["Finalize with attorney", "Wire franchise fee"],
  },
];

export default function OwnershipPath() {
  const isUnlocked = false;

  return (
    <PageLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground">Your Ownership Path</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            A step-by-step journey from exploration to franchise ownership
          </p>
        </div>

        {/* Unlock CTA for locked state */}
        {!isUnlocked && (
          <Card className="max-w-xl mx-auto mb-12 border-primary/20 bg-primary/5">
            <CardContent className="p-8 text-center">
              <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Unlock Your Ownership Path
              </h2>
              <p className="text-muted-foreground mb-6">
                Talk to an advisor to activate your personalized journey. They'll guide you through each step.
              </p>
              <Button variant="cta" size="lg" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Talk to an Advisor
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Steps */}
        <div className="max-w-3xl mx-auto space-y-6">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-20 w-0.5 h-16 bg-border" />
              )}

              <Card
                className={cn(
                  "transition-all",
                  step.status === "locked" ? "opacity-60" : ""
                )}
              >
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Step icon */}
                    <div
                      className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0",
                        step.status === "completed"
                          ? "bg-primary text-primary-foreground"
                          : step.status === "current"
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {step.status === "completed" ? (
                        <CheckCircle2 className="w-8 h-8" />
                      ) : step.status === "locked" ? (
                        <Lock className="w-6 h-6" />
                      ) : (
                        <step.icon className="w-8 h-8" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <Badge variant="soft" className="text-xs">
                              Step {step.id}
                            </Badge>
                            {step.status === "locked" && (
                              <Badge variant="outline" className="text-xs gap-1">
                                <Lock className="w-3 h-3" />
                                Locked
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-foreground mt-2">
                            {step.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Takeaways & Actions - shown for unlocked steps */}
                      {step.status !== "locked" && (
                        <div className="mt-6 grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-2">
                              Key Takeaways
                            </h4>
                            <ul className="space-y-1">
                              {step.takeaways.map((item, i) => (
                                <li
                                  key={i}
                                  className="text-sm text-muted-foreground flex items-start gap-2"
                                >
                                  <Circle className="w-1.5 h-1.5 mt-2 fill-current flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-2">
                              Action Items
                            </h4>
                            <ul className="space-y-1">
                              {step.actions.map((item, i) => (
                                <li
                                  key={i}
                                  className="text-sm text-muted-foreground flex items-center gap-2"
                                >
                                  <ChevronRight className="w-3 h-3 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="max-w-xl mx-auto mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Ready to begin your franchise ownership journey?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button variant="outline">View My Matches</Button>
            </Link>
            <Button variant="cta" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Schedule Advisor Call
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
