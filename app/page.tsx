import { Suspense } from 'react'
import UniversityList from './UniversityCard'

// This forces Next.js to fetch fresh data on every request
export const dynamic = 'force-dynamic'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || ''

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-10 mt-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find your perfect Res</h1>
          <p className="text-lg text-gray-600 mb-8">Search across all major universities in South Africa.</p>
          
          <form className="max-w-2xl mx-auto" action="/">
            <input 
              type="text" 
              name="q" 
              defaultValue={query}
              placeholder="Search by university name (e.g. TUT, Cape Town, Wits)..." 
              className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </form>
        </div>

        <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-2">
          <h2 className="text-2xl font-bold text-gray-800">Browse by University</h2>
          <span className="text-sm text-gray-500">{query ? `Search results for "${query}"` : 'All Universities'}</span>
        </div>
        
        <Suspense fallback={<p className="text-gray-500 text-center py-8">Loading universities...</p>}>
          <UniversityList query={query} />
        </Suspense>
        
      </div>
    </main>
  )
}