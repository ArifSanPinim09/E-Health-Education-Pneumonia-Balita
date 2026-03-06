import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-[#2F5D50] text-white hover:bg-[#274E43] shadow-sm",
        outline: "border-2 border-[#2F5D50]/30 bg-white hover:bg-[#F4F7F5] hover:border-[#2F5D50] text-[#2F5D50]",
        ghost: "hover:bg-[#F4F7F5] hover:text-[#1F2933]",
      },
      size: {
        default: "min-h-[48px] min-w-[48px] px-6 py-3",
        sm: "min-h-[44px] min-w-[44px] px-4 py-2 text-sm",
        lg: "min-h-[52px] min-w-[52px] px-8 py-3 text-base",
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
