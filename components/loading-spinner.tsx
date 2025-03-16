import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "default" | "sm" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "default", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <Loader2
      className={cn(
        "animate-spin text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500",
        sizeClasses[size],
        className,
      )}
    />
  )
}

