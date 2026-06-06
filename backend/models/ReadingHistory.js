import mongoose from 'mongoose';

const ReadingHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  readAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.ReadingHistory || mongoose.model('ReadingHistory', ReadingHistorySchema);
