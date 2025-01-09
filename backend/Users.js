// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {User,Otp} = require('./models/user');

const router = express.Router();
const cors=require("cors")
const nodemailer=require('nodemailer')
const mongoose = require('mongoose');

const dotenv = require('dotenv');
const Event=require("./models/event");
const Ticket=require("./models/tickets");
const Monument=require("./models/agency")
const Feedback=require("./models/feedback")
const axios=require("axios");
const Agency = require('./models/agency');
const Coupon=require('./models/coupon')

dotenv.config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
   user: process.env.EMAIL,
   pass: process.env.EMAIL_PASS,
  },
 });

// Register Route
router.post('/register', async (req, res) => {
  const { name, email, password ,location} = req.body;
console.log(req.body);
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, password,location });
    await user.save();


    const otpCode = crypto.randomInt(1000, 9999).toString();
    const otp = new Otp({ email, otp: otpCode });
    await otp.save();

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otpCode}`,
    });



    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 604800 });
    res.cookie('token', token, {
      httpOnly: false,   
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'Strict', 
      maxAge: 3600000, 
    });

    res.status(201).json({ msg: 'Otp is sent to your mail' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


//verify otp
router.post('/verify-otp', async (req, res) => {
  const { email, otpCode } = req.body;
  console.log(email,otpCode)
  try {
    const otpRecord = await Otp.findOne({ email, otp: otpCode });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    
    await User.updateOne({ email }, { isVerified: true });

    
    await Otp.deleteOne({ email, otp: otpCode });

    const user = await User.findOne({ email: email });


    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 604800 });
    res.cookie('token', token, {
      httpOnly: false,   
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'Strict', 
      maxAge: 3600000, 
    });



    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error verifying OTP', error });
  }
});




router.post('/login', async (req, res) => {
  const { email, password } = req.body;
console.log(req.body)
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn:604800 });

    res.cookie('token', token, {
      httpOnly: false,   
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'Strict', 
      maxAge: 3600000, 
    });

   
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
function authenticateToken(req, res, next) {

  const token = req.cookies.token;
  if (token == null) return res.sendStatus(401); 
  
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); 
    req.user = user;
    next();
  });
}



router.post('/userLocation', authenticateToken, async (req, res) => {
  try {
    const { street, city, state, zipCode, country } = req.body; 

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        location: {
          street,
          city,
          state,
          zipCode,
          country,
        },
      },
      { new: true, runValidators: true } 
    ).select('-password'); 

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json({success:true,message:"Location is stored in DB"}); 
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


router.get('/userdetails', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); 
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/sent-otp-forget',async(req,res)=>{
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

     const otpCode = crypto.randomInt(1000, 9999).toString();
     const otp = new Otp({ email, otp: otpCode });
     await otp.save();
 
     await transporter.sendMail({
       from: process.env.EMAIL,
       to: email,
       subject: 'Your OTP Code',
       text: `Your OTP code is ${otpCode}`,
     });




    res.status(201).json({ msg: 'Otp is sent to your mail' });

  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
})


router.post('/verify-otp-forgot', async (req, res) => {
  const { email, otpCode } = req.body;
  console.log(email,otpCode)
  try {
    const otpRecord = await Otp.findOne({ email, otp: otpCode });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    
    await User.updateOne({ email }, { isVerified: true });

    
    await Otp.deleteOne({ email, otp: otpCode });


    res.status(201).json({ message: 'Now set new password!' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error verifying OTP', error });
  }
});



router.post('/forget-pass', async (req, res) => {
  const { email,password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    
    user.password=password;
    await user.save();


    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 604800 });
    res.cookie('token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'Strict', 
      maxAge: 3600000, 
    });

    res.status(201).json({ message: 'Password changed Successfully' });
  } catch (err) {
    console.log(err)
    res.status(500).send('Server error');
  }
});

router.post('/buy-ticket',authenticateToken, async (req, res) => {
  const userId = req.user.userId ||"6708ab76b8eb6b9f753613cc"; 
  const { eventid, selectedPersons, selectedDate } = req.body; 
  
  const chosenDate = new Date(selectedDate);

  try {
    


    const currentDate = new Date();
    const fiveDaysFromNow = new Date(currentDate);
    fiveDaysFromNow.setDate(currentDate.getDate() + 5);

    if (chosenDate < currentDate || chosenDate > fiveDaysFromNow) {
      return res.status(400).json({ msg: 'Selected date must be within the next 5 days' });
    }
    const event = await Event.findById(eventid);
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    const persons = parseInt(selectedPersons, 10);
    if (!persons || persons <= 0) {
      return res.status(400).json({ msg: 'Invalid number of persons' });
    }
    if (event.totalTicketsAvailable < persons) {
      return res.status(400).json({ msg: 'Not enough tickets available' });
    }
    const tickets = [];

    const tick=[];
    for (let i = 0; i < persons; i++) {
      const ticketNo = crypto.randomBytes(16).toString('hex'); 
      const ticket = new Ticket({
        ticketNo: ticketNo,
        eventId: event._id, 
        userId: userId, 
        price: event.ticketPrice, 
        purchasedAt: Date.now(), 
        ExpirationDate: new Date(chosenDate.getTime() + 24 * 60 * 60 * 1000), 
        selectedDate: chosenDate 
      });
      await ticket.save();

      tickets.push(ticket._id);
      tick.push(ticket);
    }
    await User.updateOne(
      { _id: userId },
      { $push: { myTickets: { $each: tickets } } } 
    );
    await Event.findByIdAndUpdate(
      eventid,
      { $inc: { totalTicketsAvailable: -persons } }, 
      { new: true } 
    );

    res.status(201).json({ msg: `${persons} tickets purchased successfully`, tickets:tick });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/search-monuments/:name', async (req, res) => {
  console.log("hello world");
  const { name } = req.params; 
  const { region, priceRange, category } = req.query; 
  console.log(req.query);
  console.log(`Searching for monuments with name starting with: ${name}`);

  try {
    const regex = new RegExp('^' + name, 'i'); 
    const query = {
      MonumentName: { $regex: regex }
    };
    const monuments = await Monument.find(query);
    res.status(200).json({ monuments });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/Recommend', authenticateToken, async (req, res) => {
   const userId = req.user.userId; // Get userId from decoded token
  try {

    const tickets = await Ticket.find({ userId }).populate('eventId', 'MonumentName'); // Assuming eventId contains the MonumentName
    // Fetch tickets for the user
    // Check if any tickets were found
    if (tickets.length === 0) {
      // Fetch random 6 monuments when no tickets are found
      const randomMonuments = await Monument.aggregate([{ $sample: { size: 6 } }]);
      return res.json(randomMonuments); // Send the random monuments back to the client
    }
    // Extract the first monument name from tickets
    const firstMonumentName = "Taj Mahal"; // Get the first ticket's monument name or set default
    console.log("first", firstMonumentName);
  
    try{

      const response = await fetch('http://127.0.0.1:8000/recommend', {
        user_id: userId,
        place: firstMonumentName // Pass the first monument name
      });
      
      const recommendations = response.data.recommendations; // Assuming this structure
      const monumentDetails = await Monument.find({ _id: { $in: recommendations } });
      res.json(monumentDetails);
    }
    catch(fetchError){
      const randomMonuments = await Monument.aggregate([{ $sample: { size: 6 } }]);
      return res.json(randomMonuments);
  }
  } catch (error) {
    // console.error('Error fetching user tickets:', error);
    // res.status(500).json({ message: 'Error fetching user tickets' });
    const randomMonuments = await Monument.aggregate([{ $sample: { size: 6 } }]);
    return res.json(randomMonuments);
  }
});

router.get('/mytickets', async (req, res) => {
  const userId =req.user.userId ; 
  try {
    console.log("User ID:", userId); 
    const tickets = await Ticket.find({ userId });
    console.log(tickets);
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server error while fetching tickets." });
  }
});


router.post('/events-detail', async (req, res) => {
  const { MonumentId } = req.body; 
 console

  try {
    const currentDate = new Date();
    console.log(MonumentId,currentDate)
    const fiveDaysFromNow = new Date(currentDate);
    fiveDaysFromNow.setDate(currentDate.getDate() + 5);
    let events = await Event.find({
      MonumentId: MonumentId,
    }).limit(5);
    console.log(events)
    if (!events || events.length==0) {
      events = await Event.find({ MonumentId: MonumentId }).sort({ eventDate: 1 }).limit(10);
    }

    console.log(events)
    if (!events) {
      return res.status(404).json({ msg: 'No upcoming events found' });
    }
     console.log(events)
    return res.status(200).json({
      msg: 'Event details fetched successfully',
      events
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});







router.get('/products/:id',authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const monument = await Monument.findById(id).select(
      '-tickets -bookings -guides -ticketPrice -totalAvailableTicket -totalRevenue -events -password'
    );

    if (!monument) {
      return res.status(404).json({ msg: 'Monument not found' });
    }
    res.status(200).json({
      msg: 'Monument details fetched successfully',
      monument,
    });
  } catch (error) {
    console.error('Error fetching monument details:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});


router.post('/reviews', authenticateToken, async (req, res) => {
  const { text, rating, id } = req.body; 
  const userId = req.user.userId; 
  let userName;
  try {
    const user = await User.findOne({ _id: userId }).select('name');
    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }
    userName = user.name;
  } catch (error) {
    return res.status(500).json({ msg: 'Error fetching user details.' });
  }

  if (!userId) {
    return res.status(401).json({ msg: 'User must be logged in to submit feedback.' });
  }
  if (!id) {
    return res.status(400).json({ msg: 'Monument ID is required.' });
  }
  if (!text || !text.trim()) {
    return res.status(400).json({ msg: 'Feedback comment cannot be empty.' });
  }
  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ msg: 'Rating must be a number between 1 and 5.' });
  }

  try {
    const feedback = new Feedback({
      userId,
      userName,
      MonumentId: id,
      rating,
      comment: text.trim(),
    });

    await feedback.save();

    res.status(200).json({ msg: 'Feedback submitted successfully!', feedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ msg: 'Server error while submitting feedback.' });
  }
});

router.get('/show-review', authenticateToken, async (req, res) => {
  const limit = parseInt(req.query.limit) || 3; 
  const page = parseInt(req.query.page) || 1; 
  const id=req.query.id;

  if(!id)
  {
    return res.status(401).json({ msg: 'Something Went Wrong' });
  }
  const skip = (page - 1) * limit; 
  const MonumentId = id;
  const userId = req.user.userId;
  

  try {
    const totalFeedbacks = await Feedback.countDocuments(); 
    const feedbacks = await Feedback.find({MonumentId:MonumentId})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit).exec(); 
    console.log(feedbacks)
    res.json({
      reviews: feedbacks,
      total: totalFeedbacks,
      userId:userId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback data.' });
  }
});

router.delete('/delete-review', authenticateToken, async (req, res) => {
  const userId  = req.user.userId;  
  const  feedId= req.query.feedId
  try {
    const feedback = await Feedback.findOneAndDelete({
      _id: feedId, 
      userId, 
    });

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found or does not belong to the user' });
    }

    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/match-coupon',authenticateToken, async (req, res) => {
  const userId=req.user.userId;
  const {  couponCode ,totalCost} = req.body; // Extract userId and couponCode from the request body

  try {
    if (!userId ) {
      return res.status(400).json({ error: 'User ID  are required.' });
    }

    if (!couponCode) {
      return res.status(400).json({ message: 'coupon code are required.' });
    }

    // Find the coupon by couponCode
    const coupon = await Coupon.findOne({ couponCode });
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found.' });
    }

    if((totalCost-coupon.discountPrice)<0)
    {
      return res.status(404).json({ message: 'Coupon cannot apply on this .' });
    }

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if the coupon has already been used by the user
    if (user.coupon && user.coupon.includes(coupon._id)) {
      return res.status(400).json({ message: 'Coupon already used.' });
    }

    

    res.status(200).json({
      message: 'Coupon applied successfully.',
      couponId:coupon._id,
      couponDiscountPrice:coupon.discountPrice
    });
  } catch (error) {
    console.error('Error matching coupon:', error);
    res.status(500).json({ error: 'Server error' });
  }
});





module.exports = router;
