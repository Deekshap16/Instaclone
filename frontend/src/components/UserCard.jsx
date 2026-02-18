import { Link } from 'react-router-dom'

const Avatar = ({ src, name, size = 10 }) => (
  <div className={`w-${size} h-${size} rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0`}>
    {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : name?.[0]?.toUpperCase()}
  </div>
)

export default function UserCard({ user }) {
  return (
    <Link to={`/profile/${user._id}`} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all hover:border-gray-200">
      <Avatar src={user.profilePicture} name={user.username} size={11} />
      <div className="min-w-0">
        <p className="font-semibold text-sm truncate">{user.username}</p>
        <p className="text-xs text-gray-500 truncate">{user.fullName}</p>
        {user.bio && <p className="text-xs text-gray-400 truncate mt-0.5">{user.bio}</p>}
      </div>
    </Link>
  )
}
