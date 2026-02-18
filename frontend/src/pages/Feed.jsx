import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import PostCard from '../components/PostCard'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Feed() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [suggestions, setSuggestions] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    fetchFeed()
    fetchSuggestions()
  }, [])

  const fetchFeed = async () => {
    try {
      const { data } = await api.get('/posts/feed')
      setPosts(data)
    } catch (err) {
      toast.error('Failed to load feed')
    } finally {
      setLoading(false)
    }
  }

  const fetchSuggestions = async () => {
    try {
      const { data } = await api.get('/users/search?query=')
      const filtered = data.filter((u) => u._id !== user?._id && !user?.following?.includes(u._id))
      setSuggestions(filtered.slice(0, 5))
    } catch {}
  }

  const Avatar = ({ src, name, size = 8 }) => (
    <div className={`w-${size} h-${size} rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : name?.[0]?.toUpperCase()}
    </div>
  )

  return (
    <div className="py-8 flex gap-8">
      {/* Feed */}
      <div className="flex-1 max-w-lg mx-auto lg:mx-0">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-32" />
                    <div className="h-2 bg-gray-200 rounded w-20" />
                  </div>
                </div>
                <div className="aspect-square bg-gray-200" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <div className="text-5xl mb-4">📷</div>
            <h2 className="text-xl font-semibold mb-2">Your feed is empty</h2>
            <p className="text-gray-500 mb-4">Follow people to see their posts here</p>
            <Link to="/explore" className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
              Explore
            </Link>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={(id) => setPosts(posts.filter((p) => p._id !== id))} />
          ))
        )}
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-24">
          {/* Current user */}
          <Link to={`/profile/${user?._id}`} className="flex items-center gap-3 mb-5">
            <div className="p-0.5 rounded-full instagram-gradient">
              <div className="bg-white p-0.5 rounded-full">
                <Avatar src={user?.profilePicture} name={user?.username} size={10} />
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm">{user?.username}</p>
              <p className="text-xs text-gray-500">{user?.fullName}</p>
            </div>
          </Link>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-3">Suggested for you</p>
              <div className="space-y-3">
                {suggestions.map((u) => (
                  <Link key={u._id} to={`/profile/${u._id}`} className="flex items-center gap-3 group">
                    <Avatar src={u.profilePicture} name={u.username} size={8} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{u.username}</p>
                      <p className="text-xs text-gray-400 truncate">{u.fullName}</p>
                    </div>
                    <span className="text-xs font-semibold text-blue-500 group-hover:text-blue-600">Follow</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
