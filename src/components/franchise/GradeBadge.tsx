import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GradeBadgeProps {
  grade: "A" | "B" | "C" | "D" | "?";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const gradeConfig = {
  A: {
    variant: "gradeA" as const,
    label: "Excellent Match",
    description: "This franchise aligns perfectly with your profile",
  },
  B: {
    variant: "gradeB" as const,
    label: "Good Match",
    description: "Strong alignment with minor considerations",
  },
  C: {
    variant: "gradeC" as const,
    label: "Fair Match",
    description: "Some alignment but notable gaps exist",
  },
  D: {
    variant: "gradeD" as const,
    label: "Poor Match",
    description: "Significant misalignment with your profile",
  },
  "?": {
    variant: "soft" as const,
    label: "Unknown",
    description: "Complete your profile to see your match grade",
  },
};

export function GradeBadge({ grade, size = "md", showLabel = false }: GradeBadgeProps) {
  const config = gradeConfig[grade];

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-lg",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-bold",
          sizeClasses[size],
          grade === "A" && "bg-primary/10 text-primary border border-primary/20",
          grade === "B" && "bg-sky-light text-navy border border-sky/40",
          grade === "C" && "bg-amber-50 text-amber-700 border border-amber-200",
          grade === "D" && "bg-rose-50 text-rose-600 border border-rose-200",
          grade === "?" && "bg-muted text-muted-foreground border border-border"
        )}
      >
        {grade}
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{config.label}</span>
          <span className="text-xs text-muted-foreground">{config.description}</span>
        </div>
      )}
    </div>
  );
}

export function GradeBadgeInline({ grade }: { grade: "A" | "B" | "C" | "D" | "?" }) {
  const config = gradeConfig[grade];
  return (
    <Badge variant={config.variant} className="gap-1">
      <span className="font-bold">{grade}</span>
      <span className="font-normal">{config.label}</span>
    </Badge>
  );
}
