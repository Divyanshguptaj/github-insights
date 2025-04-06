import { Loader2 } from "lucide-react"

export const Spinner = () => (
  <div className="flex items-center justify-center w-full h-full">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
)
