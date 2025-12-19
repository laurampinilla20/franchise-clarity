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
  Star,
  TrendingUp,
  Briefcase,
  RotateCcw,
  PiggyBank,
  Users,
  HeartHandshake,
  ThumbsUp,
  Search,
  HelpCircle,
  X,
  CircleCheck,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  { id: "financial-freedom", label: "Financial freedom", description: "Build long-term wealth", icon: TrendingUp },
  { id: "be-my-own-boss", label: "Be my own boss", description: "Independence and control", icon: Briefcase },
  { id: "career-change", label: "Career change", description: "New chapter in life", icon: RotateCcw },
  { id: "semi-retirement", label: "Semi-retirement income", description: "Passive investment", icon: PiggyBank },
  { id: "family-business", label: "Family business", description: "Build something together", icon: Users },
  { id: "community-impact", label: "Community impact", description: "Make a difference locally", icon: HeartHandshake },
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

const discussPrivatelyOption = { id: "discuss-privately", label: "I'd rather discuss this privately" };

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

const roleOptions = [
  "Executive / C-Suite",
  "Manager / Director",
  "Sales Professional",
  "Operations Manager",
  "Marketing Professional",
  "Finance Professional",
  "Consultant",
  "Entrepreneur",
  "Retired",
  "Student",
  "Other",
];

const industryExperienceOptions = [
  "Food & Beverage",
  "Retail",
  "Healthcare",
  "Technology",
  "Finance",
  "Real Estate",
  "Hospitality",
  "Education",
  "Manufacturing",
  "Construction",
  "Other",
  "None",
];

const educationOptions = [
  "High School",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "MBA",
  "Doctorate",
  "Professional Certification",
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [currentRoleOpen, setCurrentRoleOpen] = useState(false);
  const [industryExperienceOpen, setIndustryExperienceOpen] = useState(false);
  const [educationOpen, setEducationOpen] = useState(false);
  const [formData, setFormData] = useState({
    goals: [] as string[],
    timeCommitment: "",
    industries: [] as string[],
    specificBrand: "",
    exploringOtherFranchises: "",
    budget: "",
    creditScore: "",
    currentRole: "",
    industryExperience: "",
    education: "",
    skills: {} as Record<string, number>,
  });

  // Progress aligned with icons: 1%, 25%, 50%, 75%, 100%
  const progressMap: Record<number, number> = {
    1: 1,
    2: 25,
    3: 50,
    4: 75,
    5: 100,
  };
  const progress = progressMap[currentStep] || 1;

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

      <main className="pt-16 flex flex-col h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl flex flex-col h-full">
          {/* Progress with Step Indicators */}
          <div className="mb-8 pt-1 relative">
            <div className="flex items-center mb-5 relative">
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {steps.length}
              </span>
              {/* Percentage aligned with last icon */}
              <div className="absolute left-0 right-0 flex justify-between pointer-events-none">
                {steps.map((step, index) => (
                  <div key={step.id} className="w-10 flex justify-center">
                    {index === steps.length - 1 && (
                      <span className="text-sm font-medium text-foreground">{Math.round(progress)}%</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative z-[1]">
                <Progress value={progress} className="h-2" />
              </div>
              {/* Step Icons positioned on progress bar */}
              <div className="absolute top-1/2 left-0 right-0 flex justify-between -translate-y-1/2 pointer-events-none z-[100]">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-colors pointer-events-auto relative z-[100]",
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
                ))}
              </div>
            </div>
          </div>

          {/* Step Content - Scrollable */}
          <div className="flex-1 overflow-y-auto animate-fade-in">
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center pt-8">
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
                        "cursor-pointer transition-all rounded-[20px] border",
                        formData.goals.includes(option.id)
                          ? "border-primary bg-primary/5"
                          : "border-[#dee8f2] hover:border-primary/50"
                      )}
                      onClick={() => toggleArrayItem("goals", option.id)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                            formData.goals.includes(option.id)
                              ? "bg-primary text-primary-foreground"
                              : "bg-[#f4f8fe] text-[#446786]"
                          )}>
                            <option.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground">{option.label}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                          </div>
                          {formData.goals.includes(option.id) && (
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-semibold text-foreground">
                    Time commitment preference
                  </label>
                  <Select
                    value={formData.timeCommitment}
                    onValueChange={(value) => setFormData({ ...formData, timeCommitment: value })}
                  >
                    <SelectTrigger className="h-12 text-base rounded-[30px] border-border">
                      <SelectValue placeholder="Select your time commitment" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label} - {option.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="text-center pt-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    Industry preferences
                  </h1>
                </div>

                {/* Q3: Specific franchise brand or industry */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-foreground block">
                    Do you have a specific franchise brand or industry in mind?
                  </label>
                  <Input
                    type="text"
                    placeholder="Type here..."
                    value={formData.specificBrand}
                    onChange={(e) => setFormData({ ...formData, specificBrand: e.target.value })}
                    className="h-12 rounded-[30px] border-[#dee8f2] focus:border-primary"
                  />
                </div>

                {/* Q4: Exploring other franchises */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-foreground block">
                    Are you open to exploring other franchises?
                  </label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      {
                        id: "yes-best-match",
                        label: "Yes, I'm open to finding the best match",
                        icon: ThumbsUp,
                      },
                      {
                        id: "yes-compare",
                        label: "Yes, I'd compare similar franchises",
                        icon: Search,
                      },
                      {
                        id: "maybe",
                        label: "Maybe, only if my preferred choice isn't available",
                        icon: HelpCircle,
                      },
                      {
                        id: "no",
                        label: "No, this franchise only",
                        icon: X,
                      },
                    ].map((option) => (
                      <Card
                        key={option.id}
                        className={cn(
                          "cursor-pointer transition-all border rounded-[20px]",
                          formData.exploringOtherFranchises === option.id
                            ? "border-primary bg-primary/5"
                            : "border-[#dee8f2] hover:border-primary/50"
                        )}
                        onClick={() => setFormData({ ...formData, exploringOtherFranchises: option.id })}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                              formData.exploringOtherFranchises === option.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-[#f4f8fe] text-[#446786]"
                            )}>
                              <option.icon className="w-5 h-5" />
                            </div>
                            <p className={cn(
                              "text-sm font-medium flex-1",
                              formData.exploringOtherFranchises === option.id
                                ? "text-primary"
                                : "text-foreground"
                            )}>
                              {option.label}
                            </p>
                            {formData.exploringOtherFranchises === option.id && (
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

            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center pt-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    Financial details
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Help us understand your investment capacity.
                  </p>
                </div>

                <div className="relative z-10 space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Investment budget</h2>
                    <div className="flex flex-wrap gap-3">
                      {budgetOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, budget: option.id })}
                          className={cn(
                            "text-sm py-2.5 px-5 rounded-[30px] cursor-pointer transition-all border font-medium relative z-10",
                            formData.budget === option.id
                              ? "bg-[#203d57] text-white border-[#203d57] shadow-sm"
                              : "bg-white text-[#446786] border-[#dee8f2] hover:bg-[#f4f8fe]"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, budget: discussPrivatelyOption.id })}
                      className={cn(
                        "text-sm py-2.5 px-5 rounded-[30px] cursor-pointer transition-all border font-medium relative z-10",
                        formData.budget === discussPrivatelyOption.id
                          ? "bg-[#203d57] text-white border-[#203d57] shadow-sm"
                          : "bg-white text-[#446786] border-[#dee8f2] hover:bg-[#f4f8fe]"
                      )}
                    >
                      {discussPrivatelyOption.label}
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    What is your approximate credit score?
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      {
                        id: "amazing",
                        label: "Amazing (720+)",
                        icon: CircleCheck,
                        color: "#54b936",
                      },
                      {
                        id: "very-good",
                        label: "Very Good (680–719)",
                        icon: CircleCheck,
                        color: "#FFB800",
                      },
                      {
                        id: "not-bad",
                        label: "Not bad (620–679)",
                        icon: AlertCircle,
                        color: "#FF8C00",
                      },
                      {
                        id: "working-on-it",
                        label: "Working on it (under 620)",
                        icon: AlertCircle,
                        color: "#ee2524",
                      },
                      {
                        id: "not-sure",
                        label: "Not sure",
                        icon: HelpCircle,
                        color: "#446786",
                      },
                    ].map((option) => (
                      <Card
                        key={option.id}
                        className={cn(
                          "cursor-pointer transition-all rounded-[20px] border",
                          formData.creditScore === option.id
                            ? "border-primary bg-primary/5"
                            : "border-[#dee8f2] hover:border-primary/50"
                        )}
                        onClick={() => setFormData({ ...formData, creditScore: option.id })}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-center gap-3">
                            <div 
                              className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                                formData.creditScore === option.id
                                  ? "bg-primary text-primary-foreground"
                                  : ""
                              )}
                              style={formData.creditScore === option.id ? {} : { backgroundColor: `${option.color}20`, color: option.color }}
                            >
                              <option.icon className="w-5 h-5" />
                            </div>
                            <span className={cn(
                              "font-medium flex-1",
                              formData.creditScore === option.id ? "text-primary" : "text-foreground"
                            )}>
                              {option.label}
                            </span>
                            {formData.creditScore === option.id && (
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

            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="text-center pt-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    Tell us about yourself
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Your background helps us find the best matches.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Current role</label>
                    <Popover open={currentRoleOpen} onOpenChange={setCurrentRoleOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          role="combobox"
                          aria-expanded={currentRoleOpen}
                          className={cn(
                            "flex h-12 w-full items-center justify-between rounded-[30px] border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                            !formData.currentRole && "text-muted-foreground"
                          )}
                        >
                          {formData.currentRole || "Select your current role"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Type here..." />
                          <CommandList>
                            <CommandEmpty>No role found.</CommandEmpty>
                            <CommandGroup>
                              {roleOptions.map((role) => (
                                <CommandItem
                                  key={role}
                                  value={role}
                                  onSelect={() => {
                                    setFormData({ ...formData, currentRole: role === formData.currentRole ? "" : role });
                                    setCurrentRoleOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.currentRole === role ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {role}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Industry experience</label>
                    <Popover open={industryExperienceOpen} onOpenChange={setIndustryExperienceOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          role="combobox"
                          aria-expanded={industryExperienceOpen}
                          className={cn(
                            "flex h-12 w-full items-center justify-between rounded-[30px] border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                            !formData.industryExperience && "text-muted-foreground"
                          )}
                        >
                          {formData.industryExperience || "Select your industry experience"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Type here..." />
                          <CommandList>
                            <CommandEmpty>No industry found.</CommandEmpty>
                            <CommandGroup>
                              {industryExperienceOptions.map((industry) => (
                                <CommandItem
                                  key={industry}
                                  value={industry}
                                  onSelect={() => {
                                    setFormData({ ...formData, industryExperience: industry === formData.industryExperience ? "" : industry });
                                    setIndustryExperienceOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.industryExperience === industry ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {industry}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Education</label>
                    <Popover open={educationOpen} onOpenChange={setEducationOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          role="combobox"
                          aria-expanded={educationOpen}
                          className={cn(
                            "flex h-12 w-full items-center justify-between rounded-[30px] border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                            !formData.education && "text-muted-foreground"
                          )}
                        >
                          {formData.education || "Select your education level"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Type here..." />
                          <CommandList>
                            <CommandEmpty>No education level found.</CommandEmpty>
                            <CommandGroup>
                              {educationOptions.map((edu) => (
                                <CommandItem
                                  key={edu}
                                  value={edu}
                                  onSelect={() => {
                                    setFormData({ ...formData, education: edu === formData.education ? "" : edu });
                                    setEducationOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.education === edu ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {edu}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-8">
                <div className="text-center pt-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    Rate your skills
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    How confident are you in each area? Click on the stars to rate.
                  </p>
                </div>

                <div className="space-y-8">
                  {skillAreas.map((skill) => (
                    <div key={skill.id} className="space-y-2">
                      <label className="text-base font-semibold text-foreground block text-center">
                        {skill.label}
                      </label>
                      <div className="flex gap-3 justify-center items-center">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            type="button"
                            className={cn(
                              "transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm",
                              formData.skills[skill.id] >= level
                                ? "text-[#FFB800]"
                                : "text-[#dee8f2] hover:text-[#FFB800]/70"
                            )}
                            onClick={() => setSkillLevel(skill.id, level)}
                            aria-label={`Rate ${level} out of 5 stars`}
                          >
                            <Star
                              className={cn(
                                "w-8 h-8 transition-all",
                                formData.skills[skill.id] >= level ? "fill-current" : "stroke-2"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation - Sticky */}
          <div className="flex justify-between pt-3 pb-3 bg-background border-t border-border mt-auto">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            <Button variant="cta" onClick={handleNext}>
              {currentStep === steps.length ? "See My Matches" : "Continue"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
