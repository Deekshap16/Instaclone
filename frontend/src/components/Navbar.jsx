import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearch, setShowSearch] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Logged out!')
  }

  const handleSearch = async (e) => {
    const q = e.target.value
    setSearchQuery(q)
    if (q.length > 1) {
      try {
        const { data } = await api.get(`/users/search?query=${q}`)
        setSearchResults(data)
        setShowSearch(true)
      } catch {}
    } else {
      setShowSearch(false)
      setSearchResults([])
    }
  }

  const isActive = (path) => location.pathname === path

  const Avatar = ({ src, name, size = 8 }) => (
    <div className={`w-${size} h-${size} rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
      {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : name?.[0]?.toUpperCase()}
    </div>
  )

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16">
      <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent flex-shrink-0">
          Instaclone
        </Link>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearch}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            className="w-full bg-gray-100 rounded-lg px-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-pink-300"
          />
          {showSearch && searchResults.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
              {searchResults.map((u) => (
                <Link
                  key={u._id}
                  to={`/profile/${u._id}`}
                  onClick={() => { setShowSearch(false); setSearchQuery('') }}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <Avatar src={u.profilePicture} name={u.username} size={8} />
                  <div>
                    <p className="text-sm font-semibold">{u.username}</p>
                    <p className="text-xs text-gray-500">{u.fullName}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          <NavIcon to="/" active={isActive('/')} title="Home">
            <svg className="w-6 h-6" fill={isActive('/') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </NavIcon>

          <NavIcon to="/explore" active={isActive('/explore')} title="Explore">
            <svg className="w-6 h-6" fill={isActive('/explore') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </NavIcon>

          <NavIcon to="/create" active={isActive('/create')} title="Create Post">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </NavIcon>

          <NavIcon to="/chat" active={location.pathname.startsWith('/chat')} title="Messages">
            <svg className="w-6 h-6" fill={location.pathname.startsWith('/chat') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </NavIcon>

          <Link to={`/profile/${user?._id}`} className={`p-2 rounded-lg transition-colors ${isActive(`/profile/${user?._id}`) ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`} title="Profile">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.profilePicture
                ? <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                : user?.username?.[0]?.toUpperCase()
              }
            </div>
          </Link>

          <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500 transition-colors ml-1" title="Logout">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}

function NavIcon({ to, active, title, children }) {
  return (
    <Link to={to} className={`p-2 rounded-lg transition-colors ${active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`} title={title}>
      {children}
    </Link>
  )
}
