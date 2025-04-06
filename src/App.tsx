import { useState } from "react"
import { SearchBar } from "./components/SearchBar"
import { RepoList } from "./components/RepoList"
import { CommitsChart } from "./components/CommitsChart"

function App() {
  interface Repo {
    id: number
    name: string
    html_url: string
    description: string
  } 
  
  const [repos, setRepos] = useState<Repo[]>([])
  
  const [chartData, setChartData] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [error, setError] = useState<string | null>(null)

  // App.tsx
  const fetchGitHubData = async (username: string) => {
    setLoading(true)
    setError(null)
  
    try {
      const usernameOnly = getUsername(username)
      const res = await fetch(`https://api.github.com/users/${usernameOnly}/repos`)
      const data = await res.json()
  
      if (!Array.isArray(data)) {
        throw new Error("User not found or unexpected response")
      }
  
      setRepos(data)
  
      // Fetch commits and build chartData
      let allCommits: { date: string; count: number }[] = []
      for (const repo of data.slice(0, 5)) { // limit to 5 repos to avoid rate limiting
        const commitsRes = await fetch(`https://api.github.com/repos/${usernameOnly}/${repo.name}/commits`)
        const commits = await commitsRes.json()
  
        if (Array.isArray(commits)) {
          const dateCounts: Record<string, number> = {}
  
          for (const commit of commits) {
            const date = new Date(commit.commit.author.date).toISOString().split("T")[0]
            dateCounts[date] = (dateCounts[date] || 0) + 1
          }
  
          // Push to overall commits list
          for (const date in dateCounts) {
            const existing = allCommits.find((d) => d.date === date)
            if (existing) {
              existing.count += dateCounts[date]
            } else {
              allCommits.push({ date, count: dateCounts[date] })
            }
          }
        }
      }
  
      // Sort the dates
      allCommits.sort((a, b) => a.date.localeCompare(b.date))
      console.log(allCommits)
      setChartData(allCommits)
  
    } catch (err) {
      console.error("Fetch error:", err)
      setError("Something went wrong. Check the username.")
    } finally {
      setLoading(false)
    }
  }
  


  const getUsername = (input: string) => {
  const match = input.match(/github\.com\/([\w-]+)/);
  return match ? match[1] : input
}

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {error && <p className="text-red-500">{error}</p>}
      <SearchBar onSearch={fetchGitHubData} />
      <RepoList repos={repos} />
      {chartData.length > 0 && <CommitsChart data={chartData} />}
    </div>
  )
}

export default App
