import Link from 'next/link'
import { Property } from '@prisma/client'

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      {/* Image */}
      <div className="h-48 w-full bg-gray-200 relative">
        {property.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={property.imageUrl} 
            alt={property.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No image available
          </div>
        )}
        <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-bold shadow">
          {property.gender === 'MIXED' ? 'Mixed' : property.gender === 'FEMALE_ONLY' ? 'Female Only' : 'Male Only'}
        </span>
      </div>
      
      {/* Details */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{property.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{property.description}</p>
        
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
          <div className="text-xl font-bold text-gray-900">
            R{property.price.toLocaleString()} <span className="text-xs font-normal text-gray-500">/ mo</span>
          </div>
          
          <Link 
            href={`/property/${property.id}`} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}