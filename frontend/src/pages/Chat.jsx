import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from '../utils/time'

const Avatar = ({ src, name, size = 10 }) => (
  <div className={`w-${size} h-${size} rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0`}>
    {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : name?.[0]?.toUpperCase()}
  </div>
)

export default function Chat() {
  const { userId } = useParams()
  const { user } = useAuth()
  const { socket } = useSocket()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchConversations()
    if (userId) loadChat(userId)
  }, [userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (msg) => {
        if (selectedUser && (msg.senderId === selectedUser._id || msg.senderId?._id === selectedUser._id)) {
          setMessages((prev) => [...prev, msg])
        }
        fetchConversations()
      })
      return () => socket.off('receiveMessage')
    }
  }, [socket, selectedUser])

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/chat/conversations')
      setConversations(data)
    } catch {}
  }

  const loadChat = async (uid) => {
    try {
      const [userRes, msgRes] = await Promise.all([api.get(`/users/${uid}`), api.get(`/chat/${uid}`)])
      setSelectedUser(userRes.data)
      setMessages(msgRes.data)
    } catch {
      toast.error('Failed to load chat')
    }
  }

  const handleSelectConversation = (conv) => {
    navigate(`/chat/${conv.user._id}`)
    setSelectedUser(conv.user)
    loadChat(conv.user._id)
  }

  const handleSearch = async (e) => {
    const q = e.target.value
    setSearchQuery(q)
    if (q.length > 1) {
      const { data } = await api.get(`/users/search?query=${q}`)
      setSearchResults(data.filter((u) => u._id !== user._id))
    } else {
      setSearchResults([])
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser) return
    setSending(true)
    try {
      const { data } = await api.post('/chat/send', { receiverId: selectedUser._id, message: newMessage })
      setMessages((prev) => [...prev, data])
      setNewMessage('')
      fetchConversations()
    } catch {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="py-6 h-[calc(100vh-5rem)]">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-lg mb-3">{user?.username}</h2>
            <input
              type="text"
              placeholder="Search to start a chat..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
            />
            {searchResults.length > 0 && searchQuery && (
              <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {searchResults.map((u) => (
                  <button key={u._id} onClick={() => { setSearchQuery(''); setSearchResults([]); navigate(`/chat/${u._id}`); setSelectedUser(u); loadChat(u._id) }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left">
                    <Avatar src={u.profilePicture} name={u.username} size={8} />
                    <div>
                      <p className="text-sm font-semibold">{u.username}</p>
                      <p className="text-xs text-gray-400">{u.fullName}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm px-4">
                <p className="text-3xl mb-2">💬</p>
                <p>No conversations yet. Search for a user to start chatting!</p>
              </div>
            ) : (
              conversations.map((conv, i) => (
                <button key={i} onClick={() => handleSelectConversation(conv)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${selectedUser?._id === conv.user._id ? 'bg-gray-50' : ''}`}>
                  <Avatar src={conv.user.profilePicture} name={conv.user.username} size={11} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{conv.user.username}</p>
                    <p className="text-xs text-gray-400 truncate">{conv.lastMessage}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <Link to={`/profile/${selectedUser._id}`}>
                  <Avatar src={selectedUser.profilePicture} name={selectedUser.username} size={10} />
                </Link>
                <Link to={`/profile/${selectedUser._id}`} className="font-semibold hover:underline">{selectedUser.username}</Link>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => {
                  const isMine = msg.sender?._id === user._id || msg.sender === user._id
                  return (
                    <div key={msg._id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'} gap-2`}>
                      {!isMine && <Avatar src={selectedUser.profilePicture} name={selectedUser.username} size={7} />}
                      <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${isMine ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                        <p>{msg.message}</p>
                        <p className={`text-xs mt-1 ${isMine ? 'text-white/70' : 'text-gray-400'}`}>{formatDistanceToNow(msg.createdAt)}</p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-gray-100 flex items-center gap-3">
                <input
                  type="text"
                  placeholder={`Message ${selectedUser.username}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pink-200"
                />
                <button type="submit" disabled={!newMessage.trim() || sending}
                  className="p-2.5 rounded-full text-white instagram-gradient disabled:opacity-40 transition-opacity">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <div className="w-20 h-20 rounded-full border-2 border-gray-200 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="font-semibold text-gray-600 mb-1">Your Messages</p>
              <p className="text-sm text-center max-w-xs">Send private messages to friends. Select a conversation or search for someone to chat with.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
