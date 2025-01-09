const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Agency = require('./models/agency'); // Import the Agency model
const Event = require('./models/event'); // Import the Agency model
const {Otp} = require('./models/user');
const nodemailer=require('nodemailer')
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const Feedback =require('./models/feedback')
const Ticket =require('./models/tickets')

dotenv.config(); // Load environment variables

const router = express.Router(); // Initialize router

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Fallback for dev


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




// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set destination for logo and images
    const filePath = file.fieldname === 'logo' ? 'uploads/companyLogo' : 'uploads/monuImages';
    cb(null, path.join(__dirname, filePath));
  },
  filename: (req, file, cb) => {
    // Ensure the agencyName is used as a prefix in the filename
    if (!req.agency || !req.agency.agencyName) {
      return cb(new Error('Agency information is missing from the request.'));
    }
    cb(null, `${req.agency.agencyName}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Multer file filter to ensure file type is valid
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept image files only
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

// Create multer instance with storage and file filter
const upload = multer({ storage, fileFilter });



router.post(
  '/setting',  authenticateToken,  upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'images', maxCount: 10 }]),

  async (req, res) => {
    const id=req.agency.agencyId;
    // console.log(req.body,id)
    try {
     

        const { ticketPrice, availableTickets, description, museumName,timing,iframe } = req.body ;
       

      // Get the uploaded logo and images URLs
      const logoUrl = req.files && req.files.logo && req.files.logo[0]
  ? `${process.env.BACK_URL}/logoUrl/${req.files.logo[0].filename}`
  : undefined;
  console.log(req.files.images)
      // const imagesUrls = req.files && req.files.images
      //   ? req.files.images.map(
      //       (file) => `${process.env.BACK_URL}/imageUrl/${file.filename}`
      //     )
      //   : [];

      const imagesUrls = req.files && req.files.images
  ? req.files.images.map((file) => `${process.env.BACK_URL}/imageUrl/${file.filename}`)
  : [];
console.log(imagesUrls)
      // Validate incoming data
      if (ticketPrice && (isNaN(ticketPrice) || ticketPrice <= 0)) {
        return res.status(400).json({ error: 'Valid ticket price is required' });
      }
      if(timing &&( timing==='' ||timing=='timing is required'))
      {
        return res.status(400).json({ error: 'Valid timing is required' });
      }
      if(iframe &&( iframe==='' ||iframe=='iframe src is required'))
        {
          return res.status(400).json({ error: 'Valid timing is required' });
        }
      if (availableTickets && (isNaN(availableTickets) || availableTickets <= 0)) {
        return res.status(400).json({ error: 'Valid number of available tickets is required' });
      }
      console.log(description)
      if(description &&( description==='' ||description=='Description is required and cannot be empty'))
      {
        return res.status(400).json({ error: 'Valid description is required' });
      }
      console.log("yo",description)
      if(museumName){
      const existingMonument = await Agency.findOne({  MonumentName: museumName, _id: { $ne: id } });

      if(existingMonument)
      {
        return res.status(400).json({ error: 'Already exist with Same name' });
      }
    }

      // Create an object to store the fields to update or create
      const updateFields = {};

      // Update only the fields that are provided in the request
      if (ticketPrice) updateFields.ticketPrice = ticketPrice;
      if (timing) updateFields.timing = timing;
      if (availableTickets) updateFields.totalAvailableTicket = availableTickets;
      if (description) updateFields.desc = description;
      if (logoUrl) updateFields.MonumentLogo = logoUrl;
      if (museumName) updateFields.MonumentName = museumName;

      console.log(updateFields.desc)
      
      // Handle images
      if (imagesUrls.length > 0) {
        // Fetch the existing images in the database
        const existingMonument = await Agency.findOne({ _id: id }).select('imageUrl');
      
        // Create a new array of image URLs by concatenating new images with the existing ones
        const updatedImages = existingMonument ? existingMonument.imageUrl.concat(imagesUrls) : imagesUrls;
      
        // Ensure the total number of images does not exceed 5
        if (updatedImages.length <= 5) {
          updateFields.imageUrl = updatedImages; // Directly assign the new array to imageUrl
        } else {
          return res.status(400).json({ error: 'Total number of images cannot exceed 5' });
        }
      }

      // console.log(imagesUrls)

      // console.log(updateFields.MonumentLogo)
      // Use findOneAndUpdate with upsert option to either update or create the document
      const updatedMonument = await Agency.findOneAndUpdate(
        { _id : id}, // Find by agencyId and monument name
        { $set: updateFields }, // Set updated fields
        { new: true, upsert: true } // Create if not exists, return the updated document
      );

      // Respond with success
      return res.status(200).json({
        message: updatedMonument ? 'Monument settings updated successfully' : 'New monument created successfully',
        data: updatedMonument,
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);



router.get('/get-setting-detail', authenticateToken, async (req, res) => {
  try {
    // Only select the specific fields that are required
    const user = await Agency.findById(req.agency.agencyId)
      .select('MonumentName MonumentLogo timing imageUrl ticketPrice totalAvailableTicket desc iframe');
    //  console.log(user)
    if (!user) {
      return res.status(404).json({ msg: 'Agency not found' });
    }

    // Prepare the required fields object
    const requiredFields = {};

    // Check if each required field is missing and add it to the requiredFields object
    requiredFields.MonumentName =!user.MonumentName? 'Monument Name is required':user.MonumentName;
    requiredFields.timing =!user.timing? 'Timing is required':user.timing;
     requiredFields.desc = !user.desc?'Description is required and cannot be empty':user.desc;
     requiredFields.MonumentLogo = !user.MonumentLogo?'Monument Logo is required':user.MonumentLogo;
     requiredFields.ticketPrice =!user.ticketPrice? 'Ticket Price is required':user.ticketPrice;
    requiredFields.totalAvailableTicket =!user.totalAvailableTicket? 'Available Tickets is required':user.totalAvailableTicket;
    requiredFields.imageUrl =(!user.imageUrl || user.imageUrl.length === 0)? 'At least one image is required':user.imageUrl;
    requiredFields.iframe = !user.iframe?'iframe src is required':user.iframe;


    // If any required field is missing, return it in the response
    if (Object.keys(requiredFields).length > 0) {
      return res.status(200).json({
        message: 'Please fill in the missing fields.',
        requiredFields,
      });
    }

    console.log(user)
    // If everything is filled, return success
    res.status(200).json({ message: 'All required fields are filled.', requiredFields });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving setting details', error });
  }
});



// Register Route
router.post('/register', async(req, res) => {
  console.log(req.file);
  // upload(req, res, async function (err) {
  //   if (err instanceof multer.MulterError) {
  //     // A Multer error occurred when uploading.
  //     return res.status(400).json({ error: err.message });
  //   } else if (err) {
  //     // An unknown error occurred when uploading.
  //     return res.status(400).json({ error: err.message });
  //   }

    // Extract other fields from the request
    const { agencyName, email, password, contactNumber, monumentName } = req.body;

    const street = req.body['location.street'];
    const city = req.body['location.city'];
    const state = req.body['location.state'];
    const zipCode = req.body['location.zipCode'];

// Create the location object
const location1 = {
  street,
  city,
  state,
  zipCode,
};


    try {
      // Check if email is already registered
      const existingAgency = await Agency.findOne({ email });
      if (existingAgency) {
        return res.status(400).json({ error: 'Agency with this email already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new agency with the uploaded file path
      const newAgency = new Agency({
        agencyName,
        email,
        password: hashedPassword,
        contactNumber,
        // MonumentLogo: req.file ? `${process.env.BACK_URL}/logoUrl/${req.file.filename}` : '', // Store the file name if uploaded
       MonumentName: monumentName,
        location:location1,
      });

      // Save to the database
      await newAgency.save();

      // Generate OTP
      const otpCode = crypto.randomInt(1000, 9999).toString();
      const otp = new Otp({ email, otp: otpCode });
      await otp.save();

      // Send OTP via email
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otpCode}`,
      });

      res.status(201).json({ message: 'OTP is sent to your email', agencyId: newAgency._id });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  // });
});


router.post('/verify-otp', async (req, res) => {
  const { email, otpCode } = req.body;
  console.log(email,otpCode)
  try {
    const otpRecord = await Otp.findOne({ email, otp: otpCode });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    
    await Agency.updateOne({ email }, { isVerified: true });

    
    await Otp.deleteOne({ email, otp: otpCode });

    const agency = await Agency.findOne({ email: email });


    const payload = { agencyId: agency._id,agencyName: agency.agencyName};
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 604800 });
    res.cookie('token', token, {
      httpOnly: false,   // Prevent JavaScript access to the cookie
      secure: process.env.NODE_ENV === 'production', // Set to true in production with HTTPS
      sameSite: 'Strict', // Controls whether cookies are sent with cross-site requests
      maxAge: 3600000, // Cookie expiry time in milliseconds
    });



    res.status(201).json({ message: 'Agency registered successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error verifying OTP', error });
  }
});





// Login Route
router.post('/login', async (req, res) => {
  console.log('')
  const { email, password } = req.body;

  try {
    // Check if the agency exists
    const agency = await Agency.findOne({ email });
    if (!agency) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, agency.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const payload = { agencyId: agency._id,agencyName: agency.agencyName};
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: false,   // Prevent JavaScript access to the cookie
      secure: process.env.NODE_ENV === 'production', // Set to true in production with HTTPS
      sameSite: 'Strict', // Controls whether cookies are sent with cross-site requests
      maxAge: 3600000, // Cookie expiry time in milliseconds
    });
    res.status(201).json({ msg: 'Agency logged in successfully' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



function authenticateToken(req, res, next) {

  const token = req.cookies.token;
  // console.log(req, " ",token)
  if (token == null) return res.sendStatus(401); // Unauthorized
  
   
  jwt.verify(token, process.env.JWT_SECRET, (err, agency) => {
    if (err) return res.sendStatus(403); // Forbidden
    console.log(agency)
    req.agency = agency;
    next();
  });
}

router.get('/agencydetails', authenticateToken, async (req, res) => {
  try {
    console.log("hello agency",req.agency.agencyId)
    const user = await Agency.findById(req.agency.agencyId).select('-password'); // Exclude password
    if (!user) return res.status(404).json({ msg: 'User not found' });
    const monument = await Agency.findById(req.agency.agencyId);
    // await monument.incrementBookingCount('2024-1-12',12);
    // await monument.incrementBookingCount('2024-2-12',10);
    // await monument.incrementBookingCount('2024-3-12',4);
    // await monument.incrementBookingCount('2024-4-12',3);
    // await monument.incrementBookingCount('2024-5-12',4);
    // await monument.incrementBookingCount('2024-6-12',4);
    // await monument.incrementBookingCount('2024-7-12',8);
    // await monument.incrementBookingCount('2024-8-12',4);
    // await monument.incrementBookingCount('2024-9-12',1);
    // await monument.incrementBookingCount('2024-10-12',4);
    // await monument.incrementBookingCount('2024-11-12',6);
    // await monument.incrementBookingCount('2024-12-12',4);
    
    // await monument.incrementBookingCount('2024-4-12',4);
    // await monument.incrementBookingCount('2024-5-12',4);
    // await monument.incrementBookingCount('2024-6-12',4);
    // await monument.incrementBookingCount('2024-7-12',4);
    // await monument.incrementBookingCount('2024-8-12',4);

    // await monument.incrementBookingCount('2024-11-12',6);
    // await monument.incrementBookingCount('2024-12-12',2);

    

    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Endpoint to get bookings for an agency
router.get('/fetch-bookings',authenticateToken, async (req, res) => {
  
  try {
    
    
    // Find the agency by ID
    const agency = await Agency.findById(req.agency.agencyId);
    if (!agency) {
      return res.status(404).json({ msg: 'Agency not found' });
    }

    // Return the bookings data
    res.status(200).json({ bookings: agency.bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});





// Create Event Route
router.post('/event-creation',authenticateToken, async (req, res) => {
     
    const monumentId = req.agency.agencyId; // Extract the monument ID from the URL
    const { eventName, totalTicketsAvailable, eventDate, eventTime, ticketPrice, description,audienceType,category} = req.body;
   
    try {
      // Find the agency (monument) by ID
      const monument = await Agency.findOne({_id:monumentId});
      if (!monument) {
        return res.status(404).json({ error: 'Agency (Monument) not found' });
      }
  
      // Create a new event linked to this agency
      const newEvent = new Event({
        eventName,
        MonumentId: monumentId, // Link the event to the monument
        eventTotalTicketsAvailable:totalTicketsAvailable,
        eventDate,
        eventTime,
        eventTicketPrice: ticketPrice,
        description,
        audience_type:audienceType,
        category
      });
  console.log(audienceType)
      // Save the event to the database
      const savedEvent = await newEvent.save();
  
      // Optionally, you can push the event ID to an events array in the monument if needed
      if (!monument.events) {
        monument.events = []; // Initialize if it doesn't exist
      }
      monument.events.push(savedEvent._id);
      await monument.save();
  
      res.status(201).json({
        message: 'Event created successfully',
        event: savedEvent,
      });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });


  


  // show events
  router.get('/events-show', authenticateToken, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const MonumentId = req.agency.agencyId;
  
    try {
      // Fetch events for the specified monument, sorted by createdAt (latest first)
      const events = await Event.find({ MonumentId: MonumentId })
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order (-1)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
  
    
  
      res.status(200).json({
        events  
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });



  // delete event

  router.delete('/events-delete/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const monumentId = req.agency.agencyId; // Extract MonumentId from authenticated token or request
    // console.log(id," ",monumentId)
    try {
      // Find the monument by MonumentId and ensure the event is linked to this monument
      const monument = await Agency.findOneAndUpdate(
        { _id: monumentId, events: id }, // Find monument by MonumentId where event ID exists
        { $pull: { events: id } }, // Remove the event ID from the events array
        { new: true } // Return the updated monument
      );
  
      if (!monument) {
        return res.status(404).json({ error: 'Monument not found or event not linked to this monument' });
      }
  
      // Delete the event
      await Event.findOneAndDelete({_id:id});
  
      res.status(200).json({
        message: 'Event deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

  // show competitors

  router.get('/competitors-show', authenticateToken, async (req, res) => {
    const { page = 1, limit = 6 } = req.query;
    const MonumentId = req.agency.agencyId;

    try {
        // Get the city of the agency making the request
        const loc = await Agency.findOne({ _id: MonumentId }, { 'location.city': 1 });
        const city = loc?.location?.city;

        // Check if city is found
        if (!city) {
            return res.status(404).json({ message: 'City not found.' });
        }

        // Pagination setup
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        // Find agencies in the specified city
        const agencies = await Agency.find({ 'location.city': city, _id: { $ne: MonumentId }})
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

        // Check if agencies were found
        if (agencies.length === 0) {
            return res.status(404).json({ message: 'No agencies found in this city.' });
        }

        // Prepare the response data
        const responseData = [];

        for (const agency of agencies) {
            // Get the first event ID if it exists
            // const firstEventId = agency.events[0];

            // let eventTime = 'N/A';
            // let ticketPrice = 0;

            // Fetch the first event details if it exists
            // if (firstEventId) {
            //     const event = await Event.findOne({_id:firstEventId}).select('eventTime ticketPrice');
            //     if (event) {
            //         eventTime = event.eventTime || 'N/A';
            //         ticketPrice = event.ticketPrice || 0;
            //     }
            // }

            responseData.push({
                agencyName: agency.agencyName, // Assuming MonumentName is the agency name
                monumentName: agency.MonumentName, // Assuming MonumentName is the same as monument name
                timing:agency.timing|| 'N/A',
                ticketPrice:agency.ticketPrice || 'N/A',
                url:agency.MonumentLogo
            });
        }

        // Send response
        res.status(200).json({
            competitors: responseData,
        });
    } catch (error) {
        console.error('Error fetching agencies:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// get reviews


router.get('/show-review', authenticateToken, async (req, res) => {
  const limit = parseInt(req.query.limit) || 3; // Default limit
  const page = parseInt(req.query.page) || 1; // Default page
  const skip = (page - 1) * limit; // Calculate skip
  const MonumentId = req.agency.agencyId;
  console.log(MonumentId)

  try {
    const totalFeedbacks = await Feedback.countDocuments(); // Total number of feedbacks
    const feedbacks = await Feedback.find({MonumentId:MonumentId})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit).exec(); // Paginate with skip and limit
    console.log(feedbacks)
    res.json({
      reviews: feedbacks,
      total: totalFeedbacks,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback data.' });
  }
});


router.get('/fetch-revenue', authenticateToken, async (req, res) => {
  const agencyId = req.agency.agencyId;
  try {
    
    console.log(agencyId)
    // Find the agency by ID
    const agency = await Agency.findById(agencyId);
    

    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }
    

    // Get current date, month, and year
    const currentDate = new Date();
    // const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentYear = currentDate.getFullYear();
    const currentMonthYear = `${currentYear}-${currentMonth}`;
    console.log(currentMonthYear)

    // Find current month's booking count
    const currentMonthBooking = agency.bookings.find(booking => booking.month === currentMonthYear);

    // If no bookings for the current month, return 0
    const bookingCount = currentMonthBooking ? currentMonthBooking.count : 0;
    const currentMonthRevenue=currentMonthBooking ? currentMonthBooking.monthlyRevenue : 0;
    // console.log(bookingCount)

    // Calculate total revenue by fetching the ticket price of the first event
    let totalRevenue = agency.totalRevenue;

    // if (bookingCount > 0 && agency.events.length > 0) {
    //   // Get the first event ID from the agency's events array
    //   const firstEventId = agency.events[0];

    //   // Fetch the event by ID to get the ticket price
    //   const event = await Event.findById(firstEventId);
    //   console.log(event,firstEventId)
    //   if (event) {
        
    //     totalRevenue = event.ticketPrice * bookingCount; // Calculate total revenue
    //   }
    // }
    // console.log()

    res.json({
      currentMonth: currentMonthYear,
      currentMonthRevenue,
      bookingCount,
      totalRevenue,
    });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/ticketScan', authenticateToken, async (req, res) => {
  const monuId = req.agency.agencyId;
  const { ticketId} = req.body;
  console.log("ticketid:",ticketId);
  try {
    const agency = await Agency.findOne({ _id: monuId });
    if (!agency) return res.status(404).json({ msg: 'Event not found' });
    const ticket = await Ticket.findOne({ _id: ticketId ,MonumentId:monuId});
    if(!ticket) return res.status(404).json({ msg: 'Ticket not found' });

    if(!(ticket.isActive))
    {
      return res.status(404).json({ msg: 'Ticket is already used' });
    }
    
    // Update the field `isActive` to false
     ticket.isActive = false;

     // Save the updated document
       await ticket.save();

   
      res.status(201).json({ msg: "You are verified , now you can enjoy your visit , have a great day!"});
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  });



  
module.exports = router;