const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  
  userName: {
    type: String,
    required: true, // Ensure the userName is provided
    trim: true, // Trim any extra spaces
  },
  
  MonumentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Monument', // Reference to the Monument model
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1, // Minimum rating value (1 star)
    max: 5, // Maximum rating value (5 stars)
  },
  comment: {
    type: String,
    trim: true, // Optional comment field for additional feedback
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically add the creation date
  },
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback;
