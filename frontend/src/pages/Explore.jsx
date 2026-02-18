import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Explore() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/posts/explore')
      setPosts(data)
    } catch {
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-8">
      <h1 className="text-xl font-bold mb-6">Explore</h1>

      {loading ? (
        <div className="grid grid-cols-3 gap-1">
          {Array(12).fill(0).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-sm" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500">No posts yet. Be the first to post!</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {posts.map((post) => (
            <Link key={post._id} to={`/profile/${post.user?._id}`} className="relative aspect-square group overflow-hidden rounded-sm">
              <img
                src={post.image}
                alt="Post"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.target.src = `https://picsum.photos/seed/${post._id}/400/400` }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                <span className="flex items-center gap-1 text-sm font-bold">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {post.likes?.length || 0}
                </span>
                <span className="flex items-center gap-1 text-sm font-bold">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12zM12 4c-4.418 0-8 3.582-8 8 0 1.39.36 2.698.99 3.836L4.13 18.87l3.14-.858A7.96 7.96 0 0012 20c4.418 0 8-3.582 8-8s-3.582-8-8-8z" clipRule="evenodd" />
                  </svg>
                  {post.comments?.length || 0}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
