"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('../../Map'), { 
  loading: () => <div className="h-72 w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">Loading map...</div> 
})

export default function PropertyDetailsPage() {
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // We grab the ID straight from the URL to bypass Next.js bugs
        const pathParts = window.location.pathname.split('/')
        const id = pathParts[pathParts.length - 1]

        if (!id) throw new Error("No ID in URL")

        const res = await fetch(`/api/property/${id}`)
        if (!res.ok) throw new Error('Property not found')
        
        const data = await res.json()
        setProperty(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-8 text-center text-gray-500 pt-20">Loading property details...</div>
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center bg-red-100 text-red-700 p-8 rounded-lg mt-10">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p>{error || "The property does not exist."}</p>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">Go back home</Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href={`/campus/${property.campus.university.slug}`} className="text-blue-600 hover:underline mb-6 inline-block font-medium">
          ← Back to {property.campus.university.name}
        </Link>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="w-full h-96 bg-gray-200 relative">
            {property.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={property.imageUrl} 
                alt={property.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">No image available</div>
            )}
            <span className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-bold shadow text-gray-800">
              {property.gender === 'MIXED' ? 'Mixed' : property.gender === 'FEMALE_ONLY' ? 'Female Only' : 'Male Only'}
            </span>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h1>
                <p className="text-gray-600 flex items-center gap-2">
                  📍 Near {property.campus.name} ({property.campus.university.name})
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">R{property.price.toLocaleString()}</p>
                <p className="text-sm text-gray-500">per month</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">About this Residence</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-8">
                {property.description}
              </p>
              
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Location</h2>
              <p className="text-sm text-gray-500 mb-4">This property is located near {property.campus.name}.</p>
              
              <Map 
                lat={property.campus.lat} 
                lng={property.campus.lng} 
                name={property.campus.name} 
              />
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button className="w-full bg-blue-600 text-white text-lg font-bold py-4 rounded-lg hover:bg-blue-700 transition shadow-md">
                Contact Landlord / Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}