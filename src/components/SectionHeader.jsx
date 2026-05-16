import { Link } from 'react-router-dom'

export default function SectionHeader({ title, link = '/products' }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <h2 className="section-title">{title}</h2>
      <Link to={link} className="text-sm font-semibold text-red-600">View all</Link>
    </div>
  )
}
