import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', fullName: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await register(form.username, form.email, form.password, form.fullName)
      navigate('/')
      toast.success('Account created! Welcome 🎉')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Instaclone
            </h1>
            <p className="text-gray-500 text-sm mt-2">Sign up to see photos from your friends</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors" />
            <input name="fullName" type="text" placeholder="Full Name" value={form.fullName} onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors" />
            <input name="username" type="text" placeholder="Username" value={form.username} onChange={handleChange} required
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors" />
            <input name="password" type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={handleChange} required
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors" />
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg font-semibold text-sm text-white instagram-gradient disabled:opacity-60">
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 mt-3 text-center shadow-sm">
          <p className="text-sm text-gray-600">
            Have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-500 hover:text-blue-600">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
