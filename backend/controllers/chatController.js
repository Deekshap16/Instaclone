const Message = require('../models/Message');

const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    if (!receiverId || !message) return res.status(400).json({ message: 'Receiver and message required' });

    const msg = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      message,
    });
    await msg.populate('sender', 'username profilePicture');
    await msg.populate('receiver', 'username profilePicture');

    // Emit via socket if available
    const io = req.app.get('io');
    if (io) {
      io.to(receiverId).emit('receiveMessage', {
        ...msg.toObject(),
        senderId: req.user._id,
      });
    }

    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'username profilePicture')
      .populate('receiver', 'username profilePicture');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getConversations = async (req, res) => {
  try {
    // Get unique users this user has chatted with
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'username profilePicture fullName')
      .populate('receiver', 'username profilePicture fullName');

    const seen = new Set();
    const conversations = [];
    for (const msg of messages) {
      const otherId =
        msg.sender._id.toString() === req.user._id.toString()
          ? msg.receiver._id.toString()
          : msg.sender._id.toString();
      if (!seen.has(otherId)) {
        seen.add(otherId);
        const otherUser =
          msg.sender._id.toString() === req.user._id.toString() ? msg.receiver : msg.sender;
        conversations.push({ user: otherUser, lastMessage: msg.message, createdAt: msg.createdAt });
      }
    }
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { sendMessage, getMessages, getConversations };
