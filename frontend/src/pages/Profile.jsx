import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

const Avatar = ({ src, name, size = 24 }) => (
  <div className={`w-${size} h-${size} rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0`}>
    {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : name?.[0]?.toUpperCase()}
  </div>
)

export default function Profile() {
  const { id } = useParams()
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ fullName: '', bio: '', username: '' })
  const [avatarFile, setAvatarFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const isOwn = user?._id === id

  useEffect(() => {
    fetchProfile()
    fetchPosts()
  }, [id])

  const fetchProfile = async () => {
    try {
      const { data } = await api.get(`/users/${id}`)
      setProfile(data)
      setFollowing(data.followers?.some((f) => f._id === user?._id || f === user?._id))
      setEditForm({ fullName: data.fullName || '', bio: data.bio || '', username: data.username || '' })
    } catch {
      toast.error('User not found')
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      const { data } = await api.get(`/posts/user/${id}`)
      setPosts(data)
    } catch {}
  }

  const handleFollow = async () => {
    try {
      if (following) {
        await api.post(`/users/unfollow/${id}`)
        setFollowing(false)
        setProfile((prev) => ({ ...prev, followers: prev.followers.filter((f) => f._id !== user?._id && f !== user?._id) }))
        toast.success('Unfollowed')
      } else {
        await api.post(`/users/follow/${id}`)
        setFollowing(true)
        setProfile((prev) => ({ ...prev, followers: [...prev.followers, { _id: user._id, username: user.username }] }))
        toast.success('Following!')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('fullName', editForm.fullName)
      formData.append('bio', editForm.bio)
      formData.append('username', editForm.username)
      if (avatarFile) formData.append('profilePicture', avatarFile)

      const { data } = await api.put('/users/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setProfile((prev) => ({ ...prev, ...data }))
      updateUser(data)
      setEditing(false)
      setAvatarFile(null)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="py-8 animate-pulse">
      <div className="flex items-center gap-8 mb-8">
        <div className="w-24 h-24 bg-gray-200 rounded-full" />
        <div className="space-y-3 flex-1">
          <div className="h-5 bg-gray-200 rounded w-40" />
          <div className="h-3 bg-gray-200 rounded w-60" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square bg-gray-200 rounded-sm" />)}
      </div>
    </div>
  )

  if (!profile) return <div className="py-20 text-center text-gray-500">User not found</div>

  return (
    <div className="py-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 bg-white rounded-2xl border border-gray-200 p-6">
        <div className="relative">
          <div className="p-1 rounded-full instagram-gradient">
            <div className="bg-white p-0.5 rounded-full">
              <Avatar src={profile.profilePicture} name={profile.username} size={24} />
            </div>
          </div>
          {editing && (
            <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1.5 cursor-pointer hover:bg-blue-600 transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setAvatarFile(e.target.files[0])} />
            </label>
          )}
        </div>

        <div className="flex-1">
          {editing ? (
            <div className="space-y-3">
              <input value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                placeholder="Username" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" />
              <input value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                placeholder="Full Name" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" />
              <textarea value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder="Bio" rows={2} maxLength={150}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 resize-none" />
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={saving}
                  className="px-5 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setEditing(false)} className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-3 flex-wrap">
                <h2 className="text-xl font-semibold">{profile.username}</h2>
                {isOwn ? (
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(true)} className="px-4 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
                      Edit Profile
                    </button>
                    <Link to="/create" className="px-4 py-1.5 text-white rounded-lg text-sm font-semibold instagram-gradient">
                      New Post
                    </Link>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={handleFollow}
                      className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${following ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'text-white instagram-gradient'}`}>
                      {following ? 'Following' : 'Follow'}
                    </button>
                    <Link to={`/chat/${id}`} className="px-4 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
                      Message
                    </Link>
                  </div>
                )}
              </div>

              <div className="flex gap-6 mb-3 text-sm">
                <span><strong>{posts.length}</strong> posts</span>
                <span><strong>{profile.followers?.length || 0}</strong> followers</span>
                <span><strong>{profile.following?.length || 0}</strong> following</span>
              </div>

              <p className="font-semibold text-sm">{profile.fullName}</p>
              {profile.bio && <p className="text-sm text-gray-600 mt-1">{profile.bio}</p>}
            </>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="border-t border-gray-200 pt-4">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📷</div>
            <p className="text-gray-500 font-semibold">{isOwn ? 'No posts yet' : 'No posts'}</p>
            {isOwn && (
              <Link to="/create" className="inline-block mt-3 px-5 py-2 text-white rounded-lg text-sm font-semibold instagram-gradient">
                Share your first photo
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {posts.map((post) => (
              <div key={post._id} className="relative aspect-square group overflow-hidden rounded-sm bg-gray-100 cursor-pointer">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
