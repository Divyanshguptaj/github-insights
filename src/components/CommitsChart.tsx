import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { ResponsiveContainer } from 'recharts';

interface Props {
  data: { date: string; count: number }[]
}

export const CommitsChart = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" />
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  )
}

