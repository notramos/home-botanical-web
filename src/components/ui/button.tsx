"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

const variantStyles: Record<string, string> = {
  primary:
    "bg-accent-green text-bg-main hover:bg-accent-light shadow-sm",
  secondary:
    "bg-accent-green/10 text-accent-green border border-accent-green/20 hover:bg-accent-light hover:text-bg-main hover:border-accent-light shadow-sm",
  outline:
    "border border-accent-green/30 text-accent-green hover:bg-accent-green/10",
  ghost: "text-accent-green hover:bg-accent-green/10",
  danger: "bg-danger text-white hover:bg-danger/90 shadow-sm",
};

const sizeStyles: Record<string, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-5 text-sm gap-2",
  lg: "h-12 px-8 text-base gap-2.5",
};

type ButtonBaseProps = {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  asChild?: boolean;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    asChild?: false;
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps & {
  asChild: true;
  href: string;
  children: React.ReactNode;
  className?: string;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      asChild,
      children,
      ...props
    },
    ref
  ) => {
    if (asChild && "href" in props && props.href) {
      const { href, ...rest } = props as ButtonAsLink & {
        href: string;
      };
      return (
        <a
          href={href}
          className={cn(
            "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 cursor-pointer",
            variantStyles[variant],
            sizeStyles[size],
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/50",
            className
          )}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200",
          variantStyles[variant],
          sizeStyles[size],
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/50 disabled:opacity-50 disabled:pointer-events-none",
          className
        )}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
