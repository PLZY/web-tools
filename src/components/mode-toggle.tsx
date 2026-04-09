"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"

    if (!("startViewTransition" in document)) {
      setTheme(newTheme)
      return
    }

    const { clientX: x, clientY: y } = e
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const transition = (document as Document & { startViewTransition: (cb: () => void) => { ready: Promise<void> } }).startViewTransition(() => {
      setTheme(newTheme)
    })

    transition.ready.then(() => {
      if (newTheme === "dark") {
        // Light → Dark: hide new (dark) snapshot, shrink old (light) snapshot
        // to reveal the real dark page underneath
        document.documentElement.animate(
          { opacity: [0, 0] },
          { duration: 400, pseudoElement: "::view-transition-new(root)" }
        )
        document.documentElement.animate(
          {
            clipPath: [
              `circle(${endRadius}px at ${x}px ${y}px)`,
              `circle(0px at ${x}px ${y}px)`,
            ],
          },
          { duration: 400, easing: "ease-in-out", pseudoElement: "::view-transition-old(root)" }
        )
      } else {
        // Dark → Light: new view (light) expands outward from the icon
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          { duration: 400, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" }
        )
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-foreground"
      onClick={handleToggle}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
