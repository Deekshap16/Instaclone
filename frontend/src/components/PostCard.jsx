import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from '../utils/time'

const Avatar = ({ src, name, size = 10 }) => (
  <div className={`w-${size} h-${size} rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0`}>
    {src ? <img src={src} alt={name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} /> : name?.[0]?.toUpperCase()}
  </div>
)

export default function PostCard({ post, onDelete }) {
  const { user } = useAuth()
  const [likes, setLikes] = useState(post.likes || [])
  const [comments, setComments] = useState(post.comments || [])
  const [commentText, setCommentText] = useState('')
  const [showComments, setShowComments] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const liked = likes.some((id) => id === user?._id || id?._id === user?._id)

  const handleLike = async () => {
    try {
      const { data } = await api.post(`/posts/like/${post._id}`)
      setLikes(data.likes)
    } catch (err) {
      toast.error('Failed to like post')
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setSubmitting(true)
    try {
      const { data } = await api.post(`/posts/comment/${post._id}`, { text: commentText })
      setComments(data)
      setCommentText('')
    } catch (err) {
      toast.error('Failed to add comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return
    try {
      await api.delete(`/posts/${post._id}`)
      toast.success('Post deleted')
      onDelete?.(post._id)
    } catch {
      toast.error('Failed to delete post')
    }
  }

  const isOwner = post.user?._id === user?._id

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <Link to={`/profile/${post.user?._id}`} className="flex items-center gap-3">
          <div className="p-0.5 rounded-full instagram-gradient">
            <div className="bg-white p-0.5 rounded-full">
              <Avatar src={post.user?.profilePicture} name={post.user?.username} size={8} />
            </div>
          </div>
          <div>
            <p className="font-semibold text-sm">{post.user?.username}</p>
            <p className="text-xs text-gray-400">{formatDistanceToNow(post.createdAt)}</p>
          </div>
        </Link>
        {isOwner && (
          <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Image */}
      <div className="aspect-square bg-gray-100">
        <img
          src={post.image}
          alt="Post"
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${post._id}/600/600` }}
        />
      </div>

      {/* Actions */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={handleLike} className={`transition-transform hover:scale-110 ${liked ? 'text-red-500' : 'text-gray-700'}`}>
            <svg className="w-6 h-6" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button onClick={() => setShowComments(!showComments)} className="text-gray-700 hover:text-gray-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <Link to={`/chat/${post.user?._id}`} className="text-gray-700 hover:text-gray-500 transition-colors ml-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Link>
        </div>

        {likes.length > 0 && (
          <p className="font-semibold text-sm mb-1">{likes.length} {likes.length === 1 ? 'like' : 'likes'}</p>
        )}

        {post.caption && (
          <p className="text-sm mb-2">
            <Link to={`/profile/${post.user?._id}`} className="font-semibold mr-1">{post.user?.username}</Link>
            {post.caption}
          </p>
        )}

        {comments.length > 0 && !showComments && (
          <button onClick={() => setShowComments(true)} className="text-sm text-gray-400 mb-2">
            View all {comments.length} comments
          </button>
        )}

        {showComments && (
          <div className="space-y-1.5 mb-2 max-h-32 overflow-y-auto">
            {comments.map((c, i) => (
              <p key={c._id || i} className="text-sm">
                <Link to={`/profile/${c.user?._id}`} className="font-semibold mr-1">{c.user?.username}</Link>
                {c.text}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Add comment */}
      <form onSubmit={handleComment} className="flex items-center gap-2 px-4 py-3 border-t border-gray-100">
        <Avatar src={user?.profilePicture} name={user?.username} size={7} />
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400"
        />
        {commentText && (
          <button type="submit" disabled={submitting} className="text-sm font-semibold text-blue-500 hover:text-blue-700 disabled:opacity-50">
            Post
          </button>
        )}
      </form>
    </div>
  )
}
