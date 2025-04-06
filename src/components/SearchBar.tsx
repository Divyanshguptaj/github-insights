import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

export const SearchBar = ({ onSearch }: { onSearch: (username: string) => void }) => {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(input)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Enter GitHub username or URL"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button type="submit">Search</Button>
    </form>
  )
}
