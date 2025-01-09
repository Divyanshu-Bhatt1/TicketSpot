const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({

  ticketNo: {
    type: String,
    unique: true, // Ensure ticket number is unique
    required: true,
  },
  MonumentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Monument',
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    // required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  purchasedAt: {
    type: Number, // Store timestamp as Number (in milliseconds)
    default: () => Date.now(), // Default to current timestamp in milliseconds
  },
  ExpirationDate: {
    type: Number, // Store timestamp as Number (in milliseconds)
    required: true, // Or set a default value here if needed
  },
  selectedDate: {
    type: Number, // Store timestamp as Number (in milliseconds)
  },
  isActive:{
    type:Boolean,
    default:true
  }
});

// Exporting the Ticket model
const Ticket = mongoose.model('Tickets', TicketSchema);
module.exports = Ticket;
