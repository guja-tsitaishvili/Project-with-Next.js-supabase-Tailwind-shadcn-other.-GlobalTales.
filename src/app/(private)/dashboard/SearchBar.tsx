'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import client from '@/api/client'

// Type definitions for fetched data
interface UserProfile {
  id: string
  full_name: string
  avatar_url: string | null
}

interface Post {
  id: string
  title: string
  description: string
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<UserProfile[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false) // controls visibility on mobile
  const router = useRouter()


     function Queryreset(){
    setOpen(false);
    setQuery('')
   }
   
  useEffect(() => {
    if (!query.trim()) {
      setUsers([])
      setPosts([])
      return
    }

    const fetchResults = async () => {
      setLoading(true)

      // Search users
      const { data: usersData } = await client
        .from('profiles')
        .select('id, full_name, avatar_url')
        .ilike('full_name', `%${query}%`)
        .limit(5)

      // Search posts
      const { data: postsData } = await client
        .from('posts')
        .select('id, title, description')
        .ilike('title', `%${query}%`)
        .limit(5)

      setUsers(usersData ?? [])
      setPosts(postsData ?? [])
      setLoading(false)
    }

    const timeout = setTimeout(fetchResults, 300)
    return () => clearTimeout(timeout)
  }, [query])  //for every query changes 



  return (
<div className="relative">
  {/* 🔍 Mobile: search icon button */}
  <button
    onClick={() => setOpen(true)}
    className="block md:hidden p-2 rounded-md hover:bg-gray-100 transition"
  >
    <Search className="w-5 h-5 text-gray-700" />
  </button>

  {/* 📱 Mobile: dropdown-style search near button */}
  {open && (
    <div
      className="fixed inset-0 z-50"
      onClick={Queryreset} // close when clicking outside
    >
      {/* anchor container near top-left (where button is) */}
      <div
        className="absolute top-2 left-2 right-2 sm:left-auto sm:right-auto w-[90%] sm:w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-3"
        onClick={(e) => e.stopPropagation()} // prevent closing on input click
      >
        {/* Search input */}
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* 🔍 Results appear directly below input */}
        {(loading || users.length > 0 || posts.length > 0) && (
          <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-100 max-h-80 overflow-y-auto">
            {loading && (
              <p className="text-sm text-gray-400 px-3 py-2">Loading...</p>
            )}

            {/* Users */}
            {users.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 px-3 mt-2 mb-1">
                  People
                </h4>
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      router.push(`/dashboard/userprofile/${u.id}`)
                      setOpen(false)
                    }}
                    className="flex items-center w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                  >
                    <img
                      src={u.avatar_url || '/default-avatar.png'}
                      alt="Profile avatar"
                      className="h-8 w-8 rounded-full mr-2"
                    />
                    <span>{u.full_name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Posts */}
            {posts.length > 0 && (
              <div className="mt-3">
                <h4 className="text-xs font-semibold text-gray-500 px-3 mb-1">
                  Posts
                </h4>
                {posts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      router.push(`/dashboard/${p.id}`)
                      setOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                  >
                    <p className="font-medium">{p.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {p.description}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )}

  {/* 🖥️ Desktop: normal search bar */}
  <div className="hidden md:block w-full max-w-xs md:max-w-sm lg:max-w-md">
    <input
      type="text"
      placeholder="Search..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* 🧾 Desktop search results */}
  {(users.length > 0 || posts.length > 0) && !open && (
    <div className="hidden md:block absolute mt-2 w-full bg-white rounded-lg shadow-lg z-30 p-2 max-h-96 overflow-y-auto">
      {loading && (
        <p className="text-sm text-gray-400 px-2">Loading...</p>
      )}

      {/* Users */}
      {users.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-500 px-2 mb-1">
            People
          </h4>
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => router.push(`/dashboard/userprofile/${u.id}`)}
              className="flex items-center w-full text-left p-2 hover:bg-gray-100 rounded-md"
            >
              <img
                src={u.avatar_url || '/default-avatar.png'}
                alt="Profile avatar"
                className="h-8 w-8 rounded-full mr-2"
              />
              <span>{u.full_name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Posts */}
      {posts.length > 0 && (
        <div className="mt-3">
          <h4 className="text-xs font-semibold text-gray-500 px-2 mb-1">
            Posts
          </h4>
          {posts.map((p) => (
            <button
              key={p.id}
              onClick={() => router.push(`/dashboard/${p.id}`)}
              className="block w-full text-left p-2 hover:bg-gray-100 rounded-md"
            >
              <p className="font-medium">{p.title}</p>
              <p className="text-xs text-gray-500 line-clamp-1">
                {p.description}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )}
</div>

  )
}
