import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link, useNavigate } from "react-router-dom";
import {
  Target,
  Building2,
  DollarSign,
  User,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: 1,
    title: "Goals",
    subtitle: "Why franchising?",
    icon: Target,
  },
  {
    id: 2,
    title: "Preferences",
    subtitle: "Industry & brand",
    icon: Building2,
  },
  {
    id: 3,
    title: "Financials",
    subtitle: "Budget & timeline",
    icon: DollarSign,
  },
  {
    id: 4,
    title: "Background",
    subtitle: "Experience & skills",
    icon: User,
  },
  {
    id: 5,
    title: "Skills",
    subtitle: "Confidence levels",
    icon: Sparkles,
  },
];

const goalOptions = [
  { id: "financial-freedom", label: "Financial freedom", description: "Build long-term wealth" },
  { id: "be-my-own-boss", label: "Be my own boss", description: "Independence and control" },
  { id: "career-change", label: "Career change", description: "New chapter in life" },
  { id: "semi-retirement", label: "Semi-retirement income", description: "Passive investment" },
  { id: "family-business", label: "Family business", description: "Build something together" },
  { id: "community-impact", label: "Community impact", description: "Make a difference locally" },
];

const timeOptions = [
  { id: "part-time", label: "Part-time", description: "10-20 hours/week" },
  { id: "full-time", label: "Full-time", description: "40+ hours/week" },
  { id: "semi-absentee", label: "Semi-absentee", description: "5-15 hours/week" },
  { id: "absentee", label: "Absentee", description: "Minimal involvement" },
];

const industryOptions = [
  "Food & Beverage",
  "Health & Fitness",
  "Home Services",
  "Retail",
  "Education",
  "Automotive",
  "Senior Care",
  "Pet Services",
  "Business Services",
  "Cleaning",
];

const budgetOptions = [
  { id: "under-50k", label: "Under $50K" },
  { id: "50k-100k", label: "$50K – $100K" },
  { id: "100k-250k", label: "$100K – $250K" },
  { id: "250k-500k", label: "$250K – $500K" },
  { id: "500k-plus", label: "$500K+" },
];

const timelineOptions = [
  { id: "asap", label: "As soon as possible" },
  { id: "3-6-months", label: "3-6 months" },
  { id: "6-12-months", label: "6-12 months" },
  { id: "exploring", label: "Just exploring" },
];

const skillAreas = [
  { id: "sales", label: "Sales & Marketing" },
  { id: "operations", label: "Operations Management" },
  { id: "finance", label: "Financial Management" },
  { id: "people", label: "People Management" },
  { id: "customer", label: "Customer Service" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    goals: [] as string[],
    timeCommitment: "",
    industries: [] as string[],
    budget: "",
    timeline: "",
    skills: {} as Record<string, number>,
  });

  const progress = (currentStep / steps.length) * 100;

  const toggleArrayItem = (field: "goals" | "industries", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const setSkillLevel = (skill: string, level: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: { ...prev.skills, [skill]: level },
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/logo.svg" 
                alt="FranchiseGrade" 
                className="h-5 w-auto"
              />
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm">
                Save & Exit
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-sm font-medium text-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mb-12">
            {steps.map((step) => (
              <div
                key={step.id}
                className={cn(
                  "flex flex-col items-center gap-2",
                  step.id === currentStep
                    ? "text-primary"
                    : step.id < currentStep
                    ? "text-primary/60"
                    : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    step.id === currentStep
                      ? "bg-primary text-primary-foreground"
                      : step.id < currentStep
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step.id < currentStep ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className="text-xs font-medium hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="animate-fade-in">
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    What are your goals?
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Select all that apply to help us understand your motivations.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {goalOptions.map((option) => (
                    <Card
                      key={option.id}
                      className={cn(
                        "cursor-pointer transition-all",
                        formData.goals.includes(option.id)
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      )}
                      onClick={() => toggleArrayItem("goals", option.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-foreground">{option.label}</h3>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                          {formData.goals.includes(option.id) && (
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Time commitment preference
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {timeOptions.map((option) => (
                      <Card
                        key={option.id}
                        className={cn(
                          "cursor-pointer transition-all",
                          formData.timeCommitment === option.id
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                        )}
                        onClick={() => setFormData({ ...formData, timeCommitment: option.id })}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-foreground">{option.label}</h3>
                              <p className="text-sm text-muted-foreground">{option.description}</p>
                            </div>
                            {formData.timeCommitment === option.id && (
                              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    Industry preferences
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Select the industries that interest you most.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                  {industryOptions.map((industry) => (
                    <Badge
                      key={industry}
                      variant={formData.industries.includes(industry) ? "chipActive" : "chip"}
                      className="text-sm py-2 px-4 cursor-pointer"
                      onClick={() => toggleArrayItem("industries", industry)}
                    >
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    Financial details
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Help us understand your investment capacity.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Investment budget</h2>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {budgetOptions.map((option) => (
                      <Card
                        key={option.id}
                        className={cn(
                          "cursor-pointer transition-all",
                          formData.budget === option.id
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                        )}
                        onClick={() => setFormData({ ...formData, budget: option.id })}
                      >
                        <CardContent className="p-4 text-center">
                          <span className={cn(
                            "font-medium",
                            formData.budget === option.id ? "text-primary" : "text-foreground"
                          )}>
                            {option.label}
                          </span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Timeline to start</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {timelineOptions.map((option) => (
                      <Card
                        key={option.id}
                        className={cn(
                          "cursor-pointer transition-all",
                          formData.timeline === option.id
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                        )}
                        onClick={() => setFormData({ ...formData, timeline: option.id })}
                      >
                        <CardContent className="p-4 text-center">
                          <span className={cn(
                            "font-medium",
                            formData.timeline === option.id ? "text-primary" : "text-foreground"
                          )}>
                            {option.label}
                          </span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    Tell us about yourself
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Your background helps us find the best matches.
                  </p>
                </div>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Current role</label>
                      <input
                        type="text"
                        placeholder="e.g., Marketing Manager"
                        className="w-full mt-2 px-4 py-3 rounded-xl bg-muted border-transparent text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Industry experience</label>
                      <input
                        type="text"
                        placeholder="e.g., Technology, Finance"
                        className="w-full mt-2 px-4 py-3 rounded-xl bg-muted border-transparent text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Education</label>
                      <input
                        type="text"
                        placeholder="e.g., Bachelor's in Business"
                        className="w-full mt-2 px-4 py-3 rounded-xl bg-muted border-transparent text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    Rate your skills
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    How confident are you in each area? (1 = Low, 5 = High)
                  </p>
                </div>

                <div className="space-y-6">
                  {skillAreas.map((skill) => (
                    <div key={skill.id} className="space-y-3">
                      <label className="text-sm font-medium text-foreground">{skill.label}</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            className={cn(
                              "flex-1 py-3 rounded-xl font-medium transition-all",
                              formData.skills[skill.id] === level
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                            onClick={() => setSkillLevel(skill.id, level)}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-12">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button variant="cta" onClick={handleNext} className="gap-2">
              {currentStep === steps.length ? "See My Matches" : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
