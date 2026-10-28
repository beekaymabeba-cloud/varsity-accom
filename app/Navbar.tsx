import Link from 'next/link'
import { auth, signIn, signOut } from './auth'

export default async function Navbar() {
  const session = await auth()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
              VarsityAccom
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium transition hidden sm:block">
              Home
            </Link>
            
            <Link 
              href="/dashboard/add-property" 
              className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition shadow-sm hidden sm:block"
            >
              + List your Res
            </Link>

            {/* Authentication Buttons */}
            {session?.user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  Hi, {session.user.name?.split(' ')[0]}
                </span>
                <form action={async () => {
                  "use server"
                  await signOut()
                }}>
                  <button className="text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 px-3 py-2 rounded-md transition">
                    Sign Out
                  </button>
                </form>
              </div>
            ) : (
              <form action={async () => {
                "use server"
                await signIn("google")
              }}>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition shadow-sm">
                  Sign In
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}