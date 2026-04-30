import * as React from "react"
import { Separator as SeparatorPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        orientation === "horizontal"
          ? "h-px w-full shrink-0 bg-border"
          : "h-full w-px shrink-0 bg-border",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
