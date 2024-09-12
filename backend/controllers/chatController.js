const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');

// Create or join a one-on-one or group chat
exports.createOrJoinChat = async (req, res) => {
    const { userIds, chatName, isGroupChat } = req.body;

    // If it's a group chat, chatName and groupAdmin should be provided
    if (isGroupChat) {
    const newChat = await Chat.create({
        chatName,
        isGroupChat,
        users: userIds,
        groupAdmin: req.user._id,
    });
    res.status(200).json(newChat);
    } else {
    // For one-on-one chats, find an existing chat or create a new one
    const existingChat = await Chat.findOne({
        isGroupChat: false,
        users: { $all: userIds },
    });

    if (existingChat) {
        res.status(200).json(existingChat);
    } else {
        const newChat = await Chat.create({
        users: userIds,
        isGroupChat: false,
        });
        res.status(200).json(newChat);
    }
  }
};

// Send a message (text or media)
exports.sendMessage = async (req, res) => {
    const { content, chatId } = req.body;
    let mediaUrl = '';

    if (req.file) {
    mediaUrl = `/uploads/${req.file.filename}`;
    }

    const newMessage = await Message.create({
    sender: req.user._id,
    content,
    chat: chatId,
    media: mediaUrl,
    });

    // Update the latest message in the chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id });

    res.status(200).json(newMessage);
};

// Fetch chat messages
exports.fetchMessages = async (req, res) => {
    const { chatId } = req.params;

    const messages = await Message.find({ chat: chatId })
        .populate('sender', 'username')
        .populate('chat');

    res.status(200).json(messages);
};
