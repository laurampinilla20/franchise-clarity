import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-border",
        // Grade badges
        gradeA: "border-primary/20 bg-primary/10 text-primary",
        gradeB: "border-sky/40 bg-sky-light text-navy",
        gradeC: "border-amber-200 bg-amber-50 text-amber-700",
        gradeD: "border-rose-200 bg-rose-50 text-rose-600",
        // Chip style
        chip: "border-border bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer",
        chipActive: "border-primary bg-primary/10 text-primary",
        // Soft badges
        soft: "border-transparent bg-muted text-muted-foreground",
        success: "border-transparent bg-primary/10 text-primary",
        warning: "border-transparent bg-amber-50 text-amber-700",
        info: "border-transparent bg-sky-light text-navy",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
