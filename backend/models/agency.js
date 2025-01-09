
const mongoose = require('mongoose');

const MonumentSchema = new mongoose.Schema({
  
  agencyName: {
    type: String,
    required: true
  },
  MonumentName: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  desc:{
    type:String,
    
  }
  ,
  contactNumber: {
    type: String,
    required: true,
  },
  MonumentLogo: {
    type: String,
    default: '', 
  },
  location: {
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
      trim: true,
    },
  },
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
  ],
totalAvailableTicket:{
   type:Number,
   default:1000
},
ticketPrice:{
  type:Number,
  default:100
},
totalRevenue:{
  type:Number,
  default:0
},
timing:{
  type: String
   
},
  bookings: [
    {
      month: {
        type: String, 
        required: true,
      },
      count: {
        type: Number,
        default: 0, 
      },
      monthlyRevenue:{
        type: Number,
        default: 0,
      }
    },
  ],
  tickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket' 
  }],
  imageUrl:[
    {
      type:String
    }
  ],
  guides:[],
  iframe:{
    type:String
  },
  category:{
     type:String
  }
});


MonumentSchema.methods.updateRevenueAndBookings = async function (
  selectedDate,
  totalPersons,
  ticketPrice
) {
  
  const [day, month, year] = selectedDate.split('/');
  const monthYear=`${year}-${month}`;


  const revenue = totalPersons * ticketPrice;


  this.totalRevenue += revenue;


  const existingBooking = this.bookings.find(booking => booking.month === monthYear);
  if (existingBooking) {
   
    existingBooking.count += totalPersons;
    existingBooking.monthlyRevenue += revenue;
  } else {
    
    this.bookings.push({
      month: monthYear,
      count: totalPersons,
      monthlyRevenue: revenue,
    });
  }


  await this.save();
};


const Agency = mongoose.model('Monument1', MonumentSchema);

module.exports = Agency;