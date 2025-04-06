import { Card } from "../components/ui/card"

interface Repo {
  id: number
  name: string
  html_url: string
  description: string
}

interface Props {
  repos: Repo[]
  onSelect: (repoName: string) => void
}

export const RepoList = ({ repos, onSelect }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {repos.length > 0 && (
        <ul>
          {repos.map(repo => (
            <Card key={repo.id} className="p-4 cursor-pointer hover:shadow-lg" onClick={() => onSelect(repo.name)}>
              <h2 className="text-lg font-semibold">{repo.name}</h2>
              <p className="text-gray-600">{repo.description}</p>
            </Card>
          ))}
        </ul>
      )}
    </div>
  )
}
