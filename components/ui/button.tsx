import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 btn-press hover-lift touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 hover-glow",
        outline: "border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
      },
      size: {
        default: "min-h-[44px] min-w-[44px] px-4 py-2",
        sm: "min-h-[44px] min-w-[44px] px-3 text-xs",
        lg: "min-h-[48px] min-w-[48px] px-8 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
