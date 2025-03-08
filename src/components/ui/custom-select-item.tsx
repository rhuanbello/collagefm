"use client"

import * as React from "react"
import { SelectItem } from "./select"

interface CustomSelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectItem> {
  children: React.ReactNode
}

export const CustomSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectItem>,
  CustomSelectItemProps
>(({ className, children, ...props }, ref) => {
  return (
    <SelectItem
      ref={ref}
      className={`data-[highlighted]:bg-indigo-50 dark:data-[highlighted]:bg-indigo-900/30 
                text-gray-800 dark:text-gray-200 
                data-[state=checked]:bg-indigo-50 dark:data-[state=checked]:bg-indigo-900/30
                cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </SelectItem>
  )
})

CustomSelectItem.displayName = "CustomSelectItem" 