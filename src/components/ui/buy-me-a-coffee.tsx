import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { AuroraText } from "./aurora-text";

export const BuyMeACoffeeButton = ({ text, className, forceRelative = false }: { text: string, className?: string, forceRelative?: boolean }) => {
  return (
    <Link 
      href="https://ko-fi.com/rhuanbello"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-center justify-center rounded-full px-4 py-1.5",
        "max-w-fit mx-auto mb-4",
        !forceRelative ? "md:fixed md:bottom-6 md:right-6 md:m-0 md:z-40" : "",
        "bg-white/70 dark:bg-gray-800/70 z-30",
        "shadow-[inset_0_-8px_10px_#8fdfff1f] dark:shadow-[inset_0_-8px_10px_#8fdfff0d]",
        "transition-all duration-300 ease-out",
        "hover:shadow-[inset_0_-5px_10px_#8fdfff3f,_0_0_20px_rgba(139,92,246,0.3)] dark:hover:shadow-[inset_0_-5px_10px_#8fdfff1f,_0_0_20px_rgba(139,92,246,0.3)]",
        "hover:scale-105 hover:-translate-y-0.5",
        "cursor-pointer hover:bg-white/90 hover:dark:bg-gray-900/90 backdrop-blur-sm",
        className
      )}
    >
      <span
        className={cn(
          "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:300%_100%] p-[1px] group-hover:bg-[length:200%_100%] group-hover:animate-gradient-fast",
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
      <span className="group-hover:animate-bounce-subtle">☕</span>
      <hr className="mx-2 h-4 w-px shrink-0 bg-purple-500 dark:bg-purple-400 group-hover:bg-gradient-to-b from-indigo-400 to-purple-600" />
      <AuroraText 
        lightColors={['#4338CA', '#8B5CF6', '#EC4899', '#F43F5E', '#3B82F6', '#06B6D4']} 
        darkColors={['#818CF8', '#A78BFA', '#F472B6', '#FB7185', '#60A5FA', '#22D3EE']} 
        className="text-sm font-medium"
      >
        {text}
      </AuroraText>
      <ChevronRight
        className="ml-1 size-4 stroke-neutral-500 transition-transform
duration-300 ease-in-out group-hover:translate-x-1.5 group-hover:stroke-purple-500"
      />
    </Link>
  )
};