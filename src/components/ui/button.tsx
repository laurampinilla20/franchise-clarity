import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-cta-hover shadow-sm hover:shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-navy-light",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Custom FranchiseGrade variants
        cta: "bg-primary text-primary-foreground hover:bg-cta-hover shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        "cta-outline": "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
        navy: "bg-secondary text-secondary-foreground hover:bg-navy-light shadow-sm",
        "navy-outline": "border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground",
        soft: "bg-muted text-foreground hover:bg-accent",
        icon: "bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground",
      },
      size: {
        default: "h-10 px-5 py-2 rounded-3xl",
        sm: "h-9 px-4 rounded-3xl text-xs",
        lg: "h-12 px-8 rounded-3xl text-base",
        xl: "h-14 px-10 rounded-3xl text-lg",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
