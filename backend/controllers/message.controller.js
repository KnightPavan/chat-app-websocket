import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'
import { getReceiverSocketId, io } from '../socket/socket.js'

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body
    const { id: receiverId } = req.params
    const { _id: senderId } = req.user

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    })

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      })
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message
    })

    if (newMessage) {
      conversation.messages.push(newMessage._id)
    }

    await Promise.all([await conversation.save(), await newMessage.save()])

    // Socket Functionality
    const receiverSocketId = getReceiverSocketId(receiverId)

    if (receiverSocketId) {
      // Send message to the receiver
      io.to(receiverSocketId).emit('newMessage', newMessage)
    }

    res.status(201).json(newMessage)
  } catch (error) {
    console.log('Error in send message controller', error.message)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params
    const { _id: senderId } = req.user

    const conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId]
      }
    }).populate('messages')

    if (!conversation) return res.status(200).json([])

    res.status(200).json(conversation.messages)
  } catch (error) {
    console.log('Error in get messages controller', error.message)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
