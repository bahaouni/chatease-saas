import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = "button"
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:brightness-110",
    gold: "bg-gold text-navy font-bold hover:brightness-110 shadow-gold",
    hero: "bg-gold text-navy font-bold text-lg px-8 py-4 rounded-full shadow-[0_0_30px_rgba(197,162,101,0.3)] hover:scale-105 transition-transform",
    heroOutline: "bg-transparent border border-gold/30 text-gold font-bold text-lg px-8 py-4 rounded-full hover:bg-gold/10 transition-colors",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    xl: "h-14 px-8 text-lg",
    icon: "h-10 w-10",
  }

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant || "default"],
        sizes[size || "default"],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
