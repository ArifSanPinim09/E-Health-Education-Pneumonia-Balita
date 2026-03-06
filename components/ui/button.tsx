import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-2xl text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 btn-press hover-lift touch-manipulation shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#1CB0F6] to-[#1890D6] text-white hover:from-[#1890D6] hover:to-[#1CB0F6] hover-glow",
        outline: "border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
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
