import { prisma } from '../../db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PropertyCard from '../../PropertyCard'

export default async function CampusPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const university = await prisma.university.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      campuses: {
        include: {
          properties: true
        }
      }
    },
  })

  if (!university) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block font-medium">
          ← Back to all universities
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{university.name}</h1>
          <p className="text-gray-600">Browse available accommodation near the campuses.</p>
        </div>

        <div className="space-y-12">
          {university.campuses.map((campus) => (
            <div key={campus.id}>
              <div className="mb-4 border-b pb-2 border-gray-300">
                <h2 className="text-2xl font-bold text-gray-800">{campus.name}</h2>
                <p className="text-sm text-gray-500">📍 {campus.address}</p>
              </div>

              {campus.properties.length === 0 ? (
                <p className="text-gray-500 italic">No accommodation listed for this campus yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campus.properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}