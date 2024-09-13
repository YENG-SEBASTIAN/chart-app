const express = require('express');
const chatController = require('../controllers/chatController');
const upload = require('../controllers/mediaController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat management and messaging between users (one-on-one or group chats)
 */

/**
 * @swagger
 * /chat/create:
 *   post:
 *     summary: Create or join a one-on-one or group chat
 *     tags: [Chat]
 *     description: Create a new chat or join an existing one. If it’s a group chat, a chat name and group admin should be provided.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user IDs involved in the chat
 *               chatName:
 *                 type: string
 *                 description: Name of the chat (required for group chats)
 *               isGroupChat:
 *                 type: boolean
 *                 description: Boolean indicating if it's a group chat
 *     responses:
 *       200:
 *         description: Chat created or joined successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Chat ID
 *                 chatName:
 *                   type: string
 *                 isGroupChat:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Array of user IDs in the chat
 *       400:
 *         description: Invalid input data
 */
router.post('/create', chatController.createOrJoinChat);

/**
 * @swagger
 * /chat/message:
 *   post:
 *     summary: Send a message (text or media) in a chat
 *     tags: [Chat]
 *     description: Send a new message in a chat. You can send either text or a media file (image/video).
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Text content of the message
 *               chatId:
 *                 type: string
 *                 description: The ID of the chat to send the message to
 *               media:
 *                 type: string
 *                 format: binary
 *                 description: Media file (image or video) to send with the message
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 sender:
 *                   type: string
 *                   description: ID of the user who sent the message
 *                 content:
 *                   type: string
 *                 media:
 *                   type: string
 *                   description: URL of the media file if uploaded
 *                 chat:
 *                   type: string
 *                   description: Chat ID
 *       400:
 *         description: Invalid input data or no media file provided
 */
router.post('/message', upload.single('media'), chatController.sendMessage);

/**
 * @swagger
 * /chat/{chatId}/messages:
 *   get:
 *     summary: Fetch messages from a chat
 *     tags: [Chat]
 *     description: Retrieve all messages from a specific chat by providing the chat ID.
 *     parameters:
 *       - in: path
 *         name: chatId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the chat
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   sender:
 *                     type: string
 *                     description: ID of the user who sent the message
 *                   content:
 *                     type: string
 *                     description: Text content of the message
 *                   media:
 *                     type: string
 *                     description: URL of the media file if available
 *                   chat:
 *                     type: string
 *                     description: Chat ID
 *       400:
 *         description: Chat not found or invalid chat ID
 */
router.get('/:chatId/messages', chatController.fetchMessages);

module.exports = router;
