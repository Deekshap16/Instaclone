import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function CreatePost() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return toast.error('Please select an image')
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) return toast.error('Please select an image')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('caption', caption)
      await api.post('/posts/create', formData)
      toast.success('Post shared! 🎉')
      navigate(`/profile/${user?._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-8 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-6 text-center">Create New Post</h1>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Image Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !preview && fileRef.current?.click()}
          className={`relative ${preview ? '' : 'aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors'} bg-gray-50 border-b border-gray-200`}
        >
          {preview ? (
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full max-h-96 object-contain" />
              <button
                onClick={(e) => { e.stopPropagation(); setPreview(null); setImage(null) }}
                className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 font-medium mb-1">Drag & drop or click to upload</p>
              <p className="text-gray-400 text-sm">PNG, JPG, GIF up to 10MB</p>
              <button
                onClick={() => fileRef.current?.click()}
                className="mt-4 px-6 py-2 text-white rounded-lg text-sm font-semibold instagram-gradient"
              >
                Select Image
              </button>
            </>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>

        {/* Caption */}
        <div className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.profilePicture
                ? <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                : user?.username?.[0]?.toUpperCase()
              }
            </div>
            <textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={2200}
              rows={4}
              className="flex-1 text-sm outline-none resize-none placeholder-gray-400 bg-transparent"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
            <span>{caption.length}/2,200</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || !image}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white instagram-gradient disabled:opacity-40 transition-opacity"
          >
            {loading ? 'Sharing...' : 'Share'}
          </button>
        </div>
      </div>
    </div>
  )
}
