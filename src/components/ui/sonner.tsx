"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          
          // 1. Force the Toast Body Colors (Success = Violet, Error = Red)
          success: 
            "group-[.toaster]:!bg-background group-[.toaster]:!text-primary group-[.toaster]:!border-primary",
          error:
            "group-[.toaster]:!bg-background group-[.toaster]:!text-red-500 group-[.toaster]:!border-red-500",
          warning:
            "group-[.toaster]:!bg-background group-[.toaster]:!text-amber-500 group-[.toaster]:!border-amber-500",
          info:
            "group-[.toaster]:!bg-background group-[.toaster]:!text-blue-500 group-[.toaster]:!border-blue-500",

          description: "group-[.toast]:text-muted-foreground",
          
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",

          // 👇 FIX: Explicitly style the 'X' (Close) Button
          // - Default: Muted text
          // - Success: Force Violet (!text-primary)
          // - Error: Force Red (!text-red-500)
          closeButton: 
            "group-[.toast]:bg-background group-[.toast]:text-muted-foreground hover:group-[.toast]:text-foreground group-data-[type=success]:!text-primary group-data-[type=success]:!border-primary group-data-[type=error]:!text-red-500 group-data-[type=error]:!border-red-500",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }