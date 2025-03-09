import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";
import { useTheme } from "next-themes";

export interface AnimatedGradientTextProps
  extends ComponentPropsWithoutRef<"div"> {
  speed?: number;
  colorFrom?: string;
  colorTo?: string;
  darkColorFrom?: string;
  darkColorTo?: string;
}

export function AnimatedGradientText({
  children,
  className,
  speed = 1,
  colorFrom = "#4f39f6",
  colorTo = "#9810fa",
  darkColorFrom = "#818cf8",
  darkColorTo = "#c084fc",
  ...props
}: AnimatedGradientTextProps) {
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === "dark" || resolvedTheme === "dark";
  
  const fromColor = isDark && darkColorFrom ? darkColorFrom : colorFrom;
  const toColor = isDark && darkColorTo ? darkColorTo : colorTo;

  return (
    <span
      suppressHydrationWarning
      style={
        {
          "--bg-size": `${speed * 300}%`,
          "--color-from": fromColor,
          "--color-to": toColor,
        } as React.CSSProperties
      }
      className={cn(
        `inline animate-gradient bg-gradient-to-r from-[var(--color-from)] via-[var(--color-to)] to-[var(--color-from)] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
