import { Card, CardContent } from "../components/ui/card"

interface Repo {
  id: number
  name: string
  html_url: string
  description: string
}

export const RepoList = ({ repos }: { repos: Repo[] }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {repos.map((repo) => (
        <Card key={repo.id}>
          <CardContent className="p-4">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold text-lg hover:underline"
            >
              {repo.name}
            </a>
            <p className="text-sm text-gray-600 mt-1">
              {repo.description || "No description"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
