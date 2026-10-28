import { prisma } from '../../db'
import { createProperty } from '../../actions'
import { auth } from '../../auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AddPropertyPage() {
  // 1. Check if the user is logged in
  const session = await auth()

  // 2. If they are not logged in, kick them back to the homepage
  if (!session?.user) {
    redirect('/')
  }

  // 3. Fetch all campuses so the landlord can select one from a dropdown
  const campuses = await prisma.campus.findMany({
    include: { university: true },
    orderBy: { name: 'asc' }
  })

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block font-medium">
          ← Back to homepage
        </Link>
        
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">List your Residence</h1>
          <p className="text-gray-600 mb-8">Welcome, {session.user.name}. Fill out the details below to add your accommodation.</p>

          <form action={createProperty} className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Residence Name</label>
              <input type="text" name="name" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. The Lofts Student Res" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" required rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Describe the amenities, WiFi, security..."></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (ZAR / month)</label>
                <input type="number" name="price" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 4500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender Policy</label>
                <select name="gender" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="MIXED">Mixed</option>
                  <option value="FEMALE_ONLY">Female Only</option>
                  <option value="MALE_ONLY">Male Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="url" name="imageUrl" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://images.unsplash.com/photo-..." />
              <p className="text-xs text-gray-500 mt-1">Paste a link to an image (e.g. from Unsplash or Imgur).</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nearest Campus</label>
              <select name="campusId" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="">Select a campus...</option>
                {campuses.map((campus) => (
                  <option key={campus.id} value={campus.id}>
                    {campus.university.name} - {campus.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white text-lg font-bold py-4 rounded-lg hover:bg-blue-700 transition shadow-md mt-4">
              Submit Listing
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}