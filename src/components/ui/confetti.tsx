'use client';

import { useCallback, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

export interface ConfettiProps {
  /** The className for the confetti container */
  className?: string;
  /** The id for the confetti canvas */
  id?: string;
  /** The number of confetti particles to launch */
  particleCount?: number;
  /** The angle in degrees at which to launch confetti */
  angle?: number;
  /** The spread in degrees of the confetti */
  spread?: number;
  /** The initial velocity of the confetti */
  startVelocity?: number;
  /** The rate at which confetti slows down */
  decay?: number;
  /** The gravity applied to confetti particles */
  gravity?: number;
  /** The horizontal drift applied to particles */
  drift?: number;
  /** Whether confetti particles are flat */
  flat?: boolean;
  /** The number of frames confetti lasts */
  ticks?: number;
  /** The origin point of the confetti */
  origin?: {
    x: number;
    y: number;
  };
  /** Array of color strings in HEX format */
  colors?: string[];
  /** Array of shapes for the confetti */
  shapes?: ("square" | "circle")[];
  /** The z-index of the confetti */
  zIndex?: number;
  /** Disables confetti for users who prefer no motion */
  disableForReducedMotion?: boolean;
  /** Whether to resize the canvas */
  resize?: boolean;
  /** Custom canvas element to draw confetti */
  canvas?: HTMLCanvasElement | null;
  /** Scaling factor for confetti size */
  scalar?: number;
}

export function Confetti({
  className,
  id = "confetti-canvas",
  particleCount = 50,
  angle = 90,
  spread = 45,
  startVelocity = 45,
  decay = 0.9,
  gravity = 1,
  drift = 0,
  flat = false,
  ticks = 200,
  origin = { x: 0.5, y: 0.5 },
  colors = ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
  shapes = ['square', 'circle'],
  zIndex = 100,
  disableForReducedMotion = false,
  resize = true,
  canvas,
  scalar = 1,
}: ConfettiProps) {
  const refConfetti = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<confetti.CreateTypes | null>(null);

  // Create a function to fire the confetti
  const fireConfetti = useCallback(() => {
    if (!instanceRef.current) return;
    
    instanceRef.current({
      particleCount,
      angle,
      spread,
      startVelocity,
      decay,
      gravity,
      drift,
      flat,
      ticks,
      origin,
      colors,
      shapes,
      scalar,
      zIndex,
    });
  }, [
    particleCount,
    angle,
    spread,
    startVelocity,
    decay,
    gravity,
    drift,
    flat,
    ticks,
    origin,
    colors,
    shapes,
    scalar,
    zIndex,
  ]);

  useEffect(() => {
    // Return early if disableForReducedMotion is true and user prefers reduced motion
    if (disableForReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const myCanvas = canvas || refConfetti.current;
    if (!myCanvas) return;

    // Correctly type the global options
    const globalOptions: confetti.GlobalOptions = {
      resize,
      useWorker: false, // Disable Web Worker to avoid cloning issues
      disableForReducedMotion,
    };

    // Create the instance and store it in a ref
    instanceRef.current = confetti.create(myCanvas, globalOptions);

    // Fire confetti immediately
    fireConfetti();

    // Use the global reset in the cleanup function
    return () => {
      // This will clear all confetti
      if (typeof confetti.reset === 'function') {
        confetti.reset();
      }
      instanceRef.current = null;
    };
  }, [
    disableForReducedMotion,
    resize,
    canvas,
    fireConfetti,
  ]);

  return (
    <canvas
      ref={refConfetti}
      id={id}
      className={cn("fixed inset-0 w-full h-full pointer-events-none z-50", className)}
      aria-hidden="true"
    />
  );
}

export const ConfettiButton = ({
  onClick,
  children,
  options,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  options?: Partial<Parameters<typeof confetti>[0]>;
}) => {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Get the origin position relative to the button
      const origin = {
        x: clientX / innerWidth,
        y: clientY / innerHeight,
      };

      // Create a one-time confetti burst at click position
      confetti({
        ...options,
        origin,
        disableForReducedMotion:
          options?.disableForReducedMotion ||
          window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      });

      onClick?.(e);
    },
    [onClick, options]
  );

  return (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  );
}; 