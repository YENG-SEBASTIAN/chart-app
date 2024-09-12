const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
    },
    media: {
        type: String, // URL of the uploaded media (image/video)
    },
    }, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
