import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold font-label transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground shadow-sm",
        tertiary:
          "border-transparent bg-tertiary text-tertiary-foreground shadow-sm",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm",
        outline: "text-foreground border-border",
        accent:
          "border-primary/25 bg-accent/80 text-primary font-bold",
        muted:
          "border-border bg-muted/60 text-muted-foreground font-mono",
        success:
          "border-primary/25 bg-accent/70 text-primary font-semibold",
        warning:
          "border-amber-300/80 bg-amber-50/80 text-amber-700 font-semibold",
        info:
          "border-blue-200 bg-blue-50/80 text-blue-700 font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
