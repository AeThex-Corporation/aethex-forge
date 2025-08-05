import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:scale-105 active:scale-95 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg hover:shadow-destructive/25",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-aethex-400/50 hover:shadow-md",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-lg hover:shadow-secondary/25",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-md",
        link: "text-primary underline-offset-4 hover:underline hover:text-aethex-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Create ripple effect
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement("span");
      ripple.style.position = "absolute";
      ripple.style.borderRadius = "50%";
      ripple.style.transform = "scale(0)";
      ripple.style.animation = "ripple 0.6s linear";
      ripple.style.backgroundColor = "rgba(255, 255, 255, 0.3)";

      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x - size / 2 + "px";
      ripple.style.top = y - size / 2 + "px";

      button.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);

      if (onClick) onClick(e);
    };

    return (
      <>
        <style>{`
          @keyframes ripple {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
        `}</style>
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          onClick={asChild ? onClick : handleClick}
          {...props}
        />
      </>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
