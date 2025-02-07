import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-gray-700 bg-gray-800 text-gray-100 shadow transition-colors",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

export { Card } 