import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  metricType: {
    type: String,
    required: true,
    enum: ['view', 'search', 'category']
  },
  key: {
    type: String,
    required: true
  },
  title: String, // Optional: article title for views, metadata for others
  category: String, // Optional: category reference
  count: {
    type: Number,
    default: 1
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure uniqueness for easy upserts
AnalyticsSchema.index({ metricType: 1, key: 1 }, { unique: true });

export default mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema);
