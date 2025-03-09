import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "./animated-gradient-text";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const BuyMeCoffeeButton = ({ text }: { text: string }) => {
  return (
    <Link 
      href="https://www.buymeacoffee.com/rhuanbello"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] dark:shadow-[inset_0_-8px_10px_#8fdfff0d] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] dark:hover:shadow-[inset_0_-5px_10px_#8fdfff1f] cursor-pointer"
    >
      <span
        className={cn(
          "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:300%_100%] p-[1px]",
        )}
        style={{
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "subtract",
          WebkitClipPath: "padding-box",
        }}
      />
      ☕
      <hr className="mx-2 h-4 w-px shrink-0 bg-purple-500 dark:bg-purple-400" />
      <AnimatedGradientText 
        className="text-sm font-medium"
        colorFrom="#4f39f6" // indigo-600
        colorTo="#9333ea" // purple-600
        darkColorFrom="#818cf8" // indigo-400
        darkColorTo="#c084fc" // purple-400
      >
        {text}
      </AnimatedGradientText>
      <ChevronRight
        className="ml-1 size-4 stroke-neutral-500 transition-transform
duration-300 ease-in-out group-hover:translate-x-0.5"
      />
    </Link>
  )
};