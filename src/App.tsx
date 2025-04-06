import { useState } from "react"
import { SearchBar } from "./components/SearchBar"
import { RepoList } from "./components/RepoList"
import { CommitsChart } from "./components/CommitsChart"
import { Spinner } from "./components/Spinner"
import toast, { Toaster } from "react-hot-toast"

interface Repo {
  id: number
  name: string
  html_url: string
  description: string
}

function App() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [chartData, setChartData] = useState<{ date: string; count: number }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [username, setUsername] = useState("")
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)

  const getUsername = (input: string) => {
    const match = input.match(/github\.com\/([\w-]+)/)
    return match ? match[1] : input
  }

  const fetchGitHubData = async (inputUsername: string) => {
    setLoading(true)
    setError(null)

    try {
      const usernameOnly = getUsername(inputUsername)
      setUsername(usernameOnly)

      const res = await fetch(`https://api.github.com/users/${usernameOnly}/repos`)
      const data = await res.json()

      if (!Array.isArray(data)) {
        toast.error("User not found")
        throw new Error("Unexpected response format")
      }

      setRepos(data)
      setChartData([])
      setSelectedRepo(null)
    } catch (err) {
      toast.error("Error fetching repos")
      setError("Could not load repos")
    } finally {
      setLoading(false)
    }
  }

  const fetchCommits = async (username: string, repo: string) => {
    const res = await fetch(`https://api.github.com/repos/${username}/${repo}/commits?per_page=100`)
    return await res.json()
  }

  const processCommitDates = (commits: any[]) => {
    const dailyCounts: Record<string, number> = {}

    for (const commit of commits) {
      const date = new Date(commit.commit.author.date).toISOString().split("T")[0]
      dailyCounts[date] = (dailyCounts[date] || 0) + 1
    }

    return Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  const handleRepoSelect = async (repoName: string) => {
    setLoading(true)
    setChartData([])
    setSelectedRepo(repoName)

    try {
      const commits = await fetchCommits(username, repoName)
      const chart = processCommitDates(commits)
      setChartData(chart)
    } catch (err) {
      toast.error("Error fetching commits")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen bg-gray-100 overflow-auto">
      <Toaster position="top-right" />
      {loading ? (
        <Spinner />
      ) : (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {error && <p className="text-red-500">{error}</p>}
          <SearchBar onSearch={fetchGitHubData} />
          <RepoList repos={repos} onSelect={handleRepoSelect} />
          {selectedRepo && chartData.length > 0 && (
            <>
              <h2 className="text-xl font-semibold text-center text-indigo-600">
                Daily Commits for: {selectedRepo}
              </h2>
              <CommitsChart data={chartData} />
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default App
