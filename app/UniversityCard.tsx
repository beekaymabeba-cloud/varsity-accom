import { prisma } from './db'
import Link from 'next/link'

export default async function UniversityList({ query }: { query: string }) {
  const universities = await prisma.university.findMany({
    where: query ? {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { slug: { contains: query, mode: 'insensitive' } }
      ]
    } : {},
    include: { campuses: true },
  })

  if (universities.length === 0) {
    return <p className="text-gray-500 text-center py-8">No universities found matching "{query}"</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {universities.map((uni) => (
        <Link href={`/campus/${uni.slug}`} key={uni.id}>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer h-full">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{uni.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{uni.city}, {uni.province}</p>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Campuses:</p>
              {uni.campuses.map((campus) => (
                <div key={campus.id} className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                  📍 {campus.name}
                </div>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}