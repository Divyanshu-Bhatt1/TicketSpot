
const dotenv = require('dotenv');
const express = require('express');
const functions = require('@google-cloud/functions-framework');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Agency = require('./models/agency');
const axios = require("axios")
const Event = require("./models/event");
const Ticket = require('./models/tickets')
const cookieParser = require('cookie-parser');
const app = express();
const translate = require("google-translate-api-x");
const jwt = require('jsonwebtoken');
const path = require('path');
const { User, Otp } = require('./models/user');
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/logoUrl', express.static(path.join(__dirname, 'uploads/companyLogo')));
app.use('/imageUrl', express.static(path.join(__dirname, 'uploads/monuImages')));
const crypto = require('crypto');
dotenv.config();

const cors = require("cors");


const corsOptions = {
  origin:  [
    `${process.env.FRONT_URL1}`,
    `${process.env.FRONT_URL2}`
  ], // Replace with your frontend origins
  credentials: true, // Allow credentials (cookies)
};
app.use(cors(corsOptions));

// const allowedOrigins = [
//   `${process.env.FRONT_URL1}`,
//   `${process.env.FRONT_URL2}`
// ];

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//     console.log('Request Origin:', origin)
//   },
//   credentials: true
// }));


const authRoutes = require('./Users');
const Monument = require("./Monumentdata");



mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('MongoDB connected successfully');
}).catch((err) => {
  console.error('MongoDB connection error:', err.message, err);
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

app.post("/fetchmuseumtechnological", async (req, res) => {
  try {
    console.log(req.body);
    const Category = req.body.Category;
    const { city, date } = req.body;

    console.log("Category:", Category, "City:", city, "Date:", date);

    // Fetch monuments in the specified city and category
    let monuments = await Agency.find({ 
      category: Category, 
      "location.city": city  
    });

    console.log("Monuments Found:", monuments);

    // If no monuments are found for the specified category and city
    if (monuments.length === 0) {
      console.log("No monuments found for the specified category and city, fetching random monuments...");

 // Fetch random monuments from the database
const randomMonuments = await Agency.aggregate([
  { 
    $match: { "location.city": city}  // First, filter by city
  },
  { 
    $sample: { size: 5 }  // Then randomly sample 5 documents
  }
]);

      console.log("Random Monuments:", randomMonuments);

      return res.status(200).json({
        message: `Sorry, we couldn't find any monuments for the category "${Category}" in "${city}". Here are some random monuments from other categories and places:`,
        monuments: randomMonuments,
      });
    }

    // Return the monuments if found
    res.json({monuments,
    });
  } catch (error) {
    try {
      const events = await Event.aggregate([
        { $sample: { size: 5 } },
        { $sort: { eventTicketPrice: 1 } }
      ]);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Error fetching events" });
    }
  }
});
app.post('/fetchmonumentDefault', async (req, res) => {
  const { city } = req.body; // Extract the city from the request body
  try {
    const randomMonuments = await Agency.aggregate([
      {
        $sample: { size: 5 }, // Randomly sample 5 monuments
      },
    ]);

    // Return the monuments if found
    res.json(randomMonuments);
  } catch (error) {
    console.error("Error fetching technological monuments:", error);
    res.status(500).json({ message: "Error fetching technological monuments" });
  }
});

app.post("/cheapplaces", async (req, res) => {
  try {
    console.log(req.body);
    console.log("Fetching technological monuments...");

    const { city, date, budget } = req.body;
    console.log("City:", city, "date:", date, "budget:", budget);
    // Fetch monuments in the specified city and within the budget
    let monuments = await Agency.find({ 
      category: "Technological", 
      "location.city": city,
      price: { $lte: budget } // Ensure price is less than or equal to the budget
    });

    console.log("Monuments Found:", monuments);

    // Return the monuments
    res.json(monuments);
  } catch (error) {
    console.error("Error fetching technological monuments:", error);
    res.status(500).json({ message: "Error fetching technological monuments" });
  }
});


app.get("/fetchmuseumfamilyeventstamil", async (req, res) => {
  try {
    const events = await Event.aggregate([
      { $match: { audience_type: { $in: ["General", "family", "children"] } } },
      { $sample: { size: 5 } },
    ]);

    const translateObject = async (obj) => {
      const translatedObj = {};
      for (const key in obj) {
        if (typeof obj[key] === "string") {
          translatedObj[key] = await translate(obj[key], { to: "ta" });
        } else if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
          translatedObj[key] = await translateObject(obj[key]);
        } else if (Array.isArray(obj[key])) {
          translatedObj[key] = await Promise.all(
            obj[key].map(async (item) =>
              typeof item === "object" ? await translateObject(item) : item
            )
          );
        } else {
          translatedObj[key] = obj[key];
        }
      }

      return translatedObj;
    };
    const translatedEvents = await Promise.all(
      events.map(async (event) => {
        const translatedEvent = await translateObject(event);
        translatedEvent.MonumentId = event.MonumentId;
        translatedEvent.eventDate = event.eventDate;

        return translatedEvent;
      })
    );

    res.json(translatedEvents);
  } catch (error) {
    console.error("Error fetching and translating events:", error);
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
});
app.get("/fetchmuseumDefaultamil", async (req, res) => {
  try {
    const events = await Event.aggregate([
      { $match: { audience_type: { $in: ["General", "family", "children","solo","student"] } } },
      { $sample: { size: 5 } },
    ]);

    const translateObject = async (obj) => {
      const translatedObj = {};
      for (const key in obj) {
        if (typeof obj[key] === "string") {
          translatedObj[key] = await translate(obj[key], { to: "ta" });
        } else if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
          translatedObj[key] = await translateObject(obj[key]);
        } else if (Array.isArray(obj[key])) {
          translatedObj[key] = await Promise.all(
            obj[key].map(async (item) =>
              typeof item === "object" ? await translateObject(item) : item
            )
          );
        } else {
          translatedObj[key] = obj[key];
        }
      }

      return translatedObj;
    };
    const translatedEvents = await Promise.all(
      events.map(async (event) => {
        const translatedEvent = await translateObject(event);
        translatedEvent.MonumentId = event.MonumentId;
        translatedEvent.eventDate = event.eventDate;

        return translatedEvent;
      })
    );

    res.json(translatedEvents);
  } catch (error) {
    console.error("Error fetching and translating events:", error);
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
});





app.post("/fetchmuseumStudentevents", async (req, res) => {
  const { budget,city } = req.body; // Extract budget from the request body
  try {
    console.log(req.body);
    if(budget && city){
    console.log("Fetching student monuments...");

    // Use aggregate to fetch and randomly select 5 monuments within budget
    const monuments = await Agency.aggregate([
      // Stage 1: Match monuments within budget
      {
        $match: {
          ticketPrice: { $lte: budget }, 
          "location.city":city
        },
      },
      // Stage 2: Randomly sample 5 monuments
      {
        $sample: { size: 5 }, // Randomly select 5 monuments
      },
    ]);

    console.log("Random Affordable Monuments:", monuments);

    // Return the random affordable monuments
    res.json(monuments);
  } 
else{
  fetchRandomMonuments(city)
}
  }
catch (error) {
  try {
    const events = await Event.aggregate([
      { $sample: { size: 5 } },
      { $sort: { eventTicketPrice: 1 } }
    ]);
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
  }
});
async function fetchRandomMonuments(city, count = 5) {
  try {
    const randomMonuments = await Agency.aggregate([
      // Match monuments from the specified city
      { $match: { "location.city": city } },
      // Randomly sample a specified number of monuments
      { $sample: { size: count } },
      // Optionally project specific fields
      {
        $project: {
          name: 1,
          ticketPrice: 1,
          location: 1,
          category: 1,
        },
      },
    ]);
    return randomMonuments;
  } catch (error) {
    try {
      const events = await Event.aggregate([
        { $sample: { size: 5 } },
        { $sort: { eventTicketPrice: 1 } }
      ]);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Error fetching events" });
    }
  }
}

app.get("/fetchmuseumStudenteventstamil", async (req, res) => {
  try {
    const events = await Event.aggregate([
      { $match: { audience_type: { $in: ["student", "General", "Solo"] } } },
      { $sample: { size: 5 } },
      { $sort: { ticketPrice: 1 } },
    ]);

    const translateObject = async (obj) => {
      const translatedObj = {};


      for (const key in obj) {
        if (typeof obj[key] === "string") {
          translatedObj[key] = await translate(obj[key], { to: "ta" });
        } else if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {

          translatedObj[key] = await translateObject(obj[key]);
        } else if (Array.isArray(obj[key])) {

          translatedObj[key] = await Promise.all(
            obj[key].map(async (item) =>
              typeof item === "object" ? await translateObject(item) : item
            )
          );
        } else {

          translatedObj[key] = obj[key];
        }
      }

      return translatedObj;
    };


    const translatedEvents = await Promise.all(
      events.map(async (event) => {

        const translatedEvent = await translateObject(event);


        translatedEvent.MonumentId = event.MonumentId;
        translatedEvent.eventDate = event.eventDate;

        return translatedEvent;
      })
    );

    res.json(translatedEvents);
  } catch (error) {
    try {
      const events = await Event.aggregate([
        { $sample: { size: 5 } },
        { $sort: { eventTicketPrice: 1 } }
      ]);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Error fetching events" });
    }
  }
});
app.get("/fetchmuseumcheapplacetamil", async (req, res) => {
  try {
    const events = await Event.aggregate([
      { $match: { audience_type: { $in: ["student", "General", "Solo", "children", "family"] } } },
      { $sample: { size: 5 } },
      { $sort: { ticketPrice: 1 } },
    ]);

    const translateObject = async (obj) => {
      const translatedObj = {};


      for (const key in obj) {
        if (typeof obj[key] === "string") {
          translatedObj[key] = await translate(obj[key], { to: "ta" });
        } else if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {

          translatedObj[key] = await translateObject(obj[key]);
        } else if (Array.isArray(obj[key])) {

          translatedObj[key] = await Promise.all(
            obj[key].map(async (item) =>
              typeof item === "object" ? await translateObject(item) : item
            )
          );
        } else {

          translatedObj[key] = obj[key];
        }
      }

      return translatedObj;
    };


    const translatedEvents = await Promise.all(
      events.map(async (event) => {

        const translatedEvent = await translateObject(event);


        translatedEvent.MonumentId = event.MonumentId;
        translatedEvent.eventDate = event.eventDate;

        return translatedEvent;
      })
    );

    res.json(translatedEvents);
  } catch (error) {
    try {
      const events = await Event.aggregate([
        { $sample: { size: 5 } },
        { $sort: { eventTicketPrice: 1 } }
      ]);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Error fetching events" });
    }
  }
});
app.post("/fetchplace", authenticateToken, async (req, res) => {
  try {
    console.log("User:", req.user);
    const user = await User.findOne({ _id: req.user.userId });
    const city=user.location.city;
    const State=user.location.state;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(city)
    res.json({ city: city ,state:State});
  } catch (error) {
    try {
      const events = await Event.aggregate([
        { $sample: { size: 5 } },
        { $sort: { eventTicketPrice: 1 } }
      ]);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Error fetching events" });
    }
  }
});

app.post("/category", async (req, res) => {
  try {
    console.log("Fetching educational events...");

    const { category, city, state } = req.body; 
    console.log("Category:", category, "City:", city, "State:", state);
    let monuments = await Agency.find({ 
      category: category, 
      "location.city": city 
    });

    let eventsFromMonuments = [];
    if (monuments.length > 0) {
      eventsFromMonuments = await Event.find({
        monumentId: { $in: monuments.map((monument) => monument._id) },
        category: category,
      }).limit(5);
    }

    let eventsNeeded = 5 - eventsFromMonuments.length;

    if (eventsNeeded > 0) {
      const stateMonuments = await Agency.find({ 
        category: category, 
        "location.state": state,
        _id: { $nin: monuments.map((monument) => monument._id) }, 
      });

      if (stateMonuments.length > 0) {
        const stateEvents = await Event.find({
          monumentId: { $in: stateMonuments.map((monument) => monument._id) },
          category: category,
        }).limit(eventsNeeded);

        eventsFromMonuments.push(...stateEvents);
        eventsNeeded = 5 - eventsFromMonuments.length;
      }
    }

    let additionalEvents = [];
    if (eventsNeeded > 0) {
      const fetchedEventIds = eventsFromMonuments.map((event) => event._id);
      additionalEvents = await Event.aggregate([
        { 
          $match: { 
            _id: { $nin: fetchedEventIds }, 
            category: category 
          } 
        },
        { $sample: { size: eventsNeeded } }, 
      ]);
    }
    const combinedEvents = [...eventsFromMonuments, ...additionalEvents];
    console.log("Combined Events:", combinedEvents);
    res.json(combinedEvents);
  } catch (error) {
    try {
      const events = await Event.aggregate([
        { $sample: { size: 5 } },
        { $sort: { eventTicketPrice: 1 } }
      ]);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Error fetching events" });
    }
  }
});


app.get("/fetchmuseumDefault", async (req, res) => {
  try {
    const events = await Event.aggregate([
      { $sample: { size: 5 } },
      { $sort: { eventTicketPrice: 1 } }
    ]);
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
});
app.get("/fetchmuseumlowtohigh", async (req, res) => {
  try {
    const results = await Agency.aggregate([
      { $sample: { size: 2 } },
      { $sort: { ticketPrice: 1 } }
    ]);

    console.log(results);
    res.json(results);
  } catch (error) {
    console.error("Error fetching student events:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
});
app.get("/fetchmuseumfromplace/:Place", async (req, res) => {
  try {
    const { Place } = req.params;
    console.log("Searching for:", Place);
    const results = await Agency.find({
      MonumentName: {
        $regex: `^${Place.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&")}$`,
        $options: 'i'
      }
    }).sort({ ticketPrice: 1 });

    if (results.length === 0) {
      return res.status(404).json({ message: "No matching places found." });
    }

    res.json(results);
  } catch (error) {
    console.error("Error fetching museums from place:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
});


functions.http('handleWebhook', (request, response) => {
  const tag = request.body.queryResult.intent.displayName;
  console.log('Intent Display Name:', tag);

  let jsonResponse = {};

  if (tag === 'Default Welcome Intent') {
    jsonResponse = {
      fulfillmentMessages: [
        {
          text: {
            text: ['Hello from a GCF Webhook'],
          },
        },
      ],
    };
  } else if (tag === 'get-name') {
    jsonResponse = {
      fulfillmentMessages: [
        {
          text: {
            text: ['My name is Flowhook'],
          },
        },
      ],
    };
  } else if (tag === 'student_events') {
    jsonResponse = {
      fulfillmentMessages: [
        {
          text: {
            text: ['Yes, there are free events available for students. Check our website for more details.'],
          },
        },
      ],
    };
  } else {
    jsonResponse = {
      fulfillmentMessages: [
        {
          text: {
            text: [`There are no fulfillment responses defined for the "${tag}" tag.`],
          },
        },
      ],
    };
  }

  response.setHeader('Content-Type', 'application/json');
  response.status(200).send(jsonResponse);
});
const BASE_URL = "https://onopay.in/api";
app.post("/api/create-order", async (req, res) => {
  try {
    console.log(req.body);
    const response = await axios.post(`${BASE_URL}/create-order`, req.body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    console.log("response", response);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
});
app.post("/events", async (req, res) => {
  try {
    const events = await Event.aggregate([
      { $sort: { eventTicketPrice: 1 } },
      { $sample: { size: 5 } }
    ]);
    res.json(events);

  }
  catch {
    res.status(500).json({ message: "error fetching the events" });
  }
})
app.post("/api/check-order-status", async (req, res) => {
  try {
    const response = await axios.post(`${BASE_URL}/check-order-status`, req.body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error checking order status", error: error.message });
  }
});


app.post('/webhook', async (req, res) => {
  const intentName = req.body.queryResult.intent.displayName;
  const Price = req.body.queryResult.parameters.budget;
  const Date = req.body.queryResult.parameters.date;
  const Place = req.body.queryResult.parameters.any;
  console.log("Display Name", req.body);
  let result = null;
  try {
    if (Price && Date) {
      const params = {
        price: Price,
        date: Date
      }
      const results = await fetchmuseum(params);
      console.log("Results", results);
      result = "";
      for (let i = 0; i < 5; i++) {
        result += results[i].MonumentName;
        if (i < 4) {
          result += ", ";
        }
      }

    }
    let response;
    if (Place) {
      const params = {
        MonumentName: Place
      }
      const results = await fetchmuseum(params);
      console.log("result", results)
      result = results.desc
    }

    if (intentName === 'IntentName1') {
      response = await YourModel1.findOne({ name: 'some criteria' });
    } else if (intentName === 'IntentName2') {
      response = await YourModel2.findOne({ name: 'some other criteria' });
    } else {
      response = { message: 'Sorry, I don\'t understand the request.' };
    }
    console.log("reso", result);
    return res.json({
      fulfillmentText: result,
      source: 'webhook'
    });


  } catch (error) {
    console.error(error);
    return res.json({
      fulfillmentText: 'There was an error processing your request.',
      source: 'webhook'
    });
  }
});
const fetchmuseum = async (params) => {
  const { price, date, MonumentName } = params;

  try {
    let results = null;
    if (price && date) {
      results = await Agency.find({
        ticketPrice: { $lte: price },
      });
    }
    else if (MonumentName) {
      results = await Agency.findOne({
        MonumentName: MonumentName,
      });
    }

    return results;
  } catch (error) {
    console.error('Error fetching monuments:', error);
    throw new Error('Unable to fetch monuments within budget');
  }
};

app.get('/api/userdetails', authenticateToken, async (req, res) => {
  try {
    console.log(req.user.userId);
    const user = await User.findById(req.user.userId).select('-password');
    console.log(user)
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


app.get("/translate", async (req, res) => {
  const { text, lang } = req.query;

  try {
    const translated = await translate(text, { to: lang });

    res.json({ translatedText: translated.text });
  } catch (error) {
    console.error("Error translating:", error);
    res.status(500).json({ error: "Translation failed" });
  }
});


app.get('/api/userdetails', authenticateToken, async (req, res) => {
  try {
    console.log(req.user.userId);
    const user = await User.findById(req.user.userId).select('-password');
    console.log(user)
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }

});

app.post('/api/getEventOrRegular', authenticateToken, async (req, res) => {
  const { date, lang, id } = req.body;


  try {
    const agency = await Agency.findOne({ _id: id });

    if (!agency) {
      return res.status(404).json({ msg: 'Agency not found' });
    }

    const normalizedInputDate = date.slice(0, 10);
    let events = [];
    let regularVisit = null;
    const evName = await translate('Regular Visit', { to: lang });
    if (Array.isArray(agency.events) && agency.events.length === 0) {

    } else {
      events = await getEvents(id, date, lang);
    }

    const price = await translate('Ticket Price', { to: lang });
    const timing = await translate('Timing', { to: lang });
    const soldOut = await translate('Sorry, all tickets for the events are sold out.', { to: lang })

    if (agency.totalAvailableTicket > 1) {
      regularVisit = {
        eventName: evName.text,
        eventDate: normalizedInputDate,
        eventTicketPrice: `${price.text} :₹ ${agency.ticketPrice}`,
        eventTime: `${timing.text} : ${agency.timing}`,
        evId: agency._id,
        enName: 'Regular Visit',
        eventTotalTicketsAvailable: agency.totalAvailableTicket,
        ticketPrice: agency.ticketPrice
      };
    }
    if (!Array.isArray(events)) {
      events = [events];
    }
    if (regularVisit) {
      events.push(regularVisit);
    }


    return res.status(200).json({ events, soldOutMsg: soldOut.text });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

const getEvents = async (id, date, lang) => {
  try {
    const normalizedInputDate = date.slice(0, 10);
    const events = await Event.find({
      MonumentId: id,
      eventDate: {
        $eq: new Date(`${normalizedInputDate}T00:00:00.000Z`)
      },
    });

    const price = await translate('Ticket Price', { to: lang });
    const timing = await translate('Timing', { to: lang });

    const translatedEvents = await Promise.all(
      events
        .filter((event) => event.eventTotalTicketsAvailable > 1)
        .map(async (event) => {
          const translatedName = await translate(event.eventName, { to: lang });

          return {
            eventDate: normalizedInputDate,
            eventTicketPrice: `${price.text} :₹ ${event.eventTicketPrice}`,
            eventTime: `${timing.text} : ${event.eventTime}`,
            eventName: translatedName.text,
            evId: event._id,
            enName: event.eventName,
            eventTotalTicketsAvailable: event.eventTotalTicketsAvailable,
            ticketPrice: event.eventTicketPrice
          };
        })
    );




    return translatedEvents;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};


const dateToTimestamp = (dateString) => {
  const [day, month, year] = dateString.split('/');
  const date = new Date(`${year}-${month}-${day}T00:00:00`);
  return date.getTime();
};


app.post('/api/buy-ticket-Event', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { eventid, selectedPersons, selectedDate, monuId } = req.body;

  console.log(selectedDate);
  try {
    const event = await Event.findOne({ _id: eventid, MonumentId: monuId });
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    const persons = parseInt(selectedPersons, 10);
    if (!persons || persons <= 0) {
      return res.status(400).json({ msg: 'Invalid number of persons' });
    }
    if (event.eventTotalTicketsAvailable < persons) {
      return res.status(400).json({ msg: 'Not enough tickets available' });
    }
    const parsedDate = dateToTimestamp(selectedDate);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ msg: 'Invalid selected date' });
    }
    const tickets = [];
    const tick = [];

    for (let i = 0; i < persons; i++) {
      const ticketNo = crypto.randomBytes(8).toString('hex');
      const expirationDate = (parsedDate + 24 * 60 * 60 * 1000);
      const ticket = new Ticket({
        ticketNo: ticketNo,
        MonumentId: monuId,
        eventId: event._id,
        userId: userId,
        price: event.eventTicketPrice,
        ExpirationDate: expirationDate,
        selectedDate: parsedDate
      });
      await ticket.save();
      tickets.push(ticket._id);
      tick.push(ticket);
    }
    await User.updateOne(
      { _id: userId },
      { $push: { myTickets: { $each: tickets } } }
    );

    await Agency.updateOne(
      { _id: monuId },
      { $push: { tickets: { $each: tickets } } }
    );

    const user = await User.findOne({ _id: userId })

    await Event.findByIdAndUpdate(
      eventid,
      { $inc: { eventTotalTicketsAvailable: -persons } },
      { new: true }
    );

    await handleIncrementRevenue(selectedDate, persons, event.eventTicketPrice, monuId);

    res.status(201).json({ msg: `${persons} tickets purchased successfully`, tickets: tick, time: event.eventTime, name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

const handleIncrementRevenue = async (selectedDate, totalPersons, ticketPrice, monuId) => {
  try {
    const agency = await Agency.findOne({ _id: monuId });
    if (!agency) return res.status(404).json({ msg: 'Event not found' });

    await agency.updateRevenueAndBookings(selectedDate, totalPersons, ticketPrice);
    return;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}


app.post('/api/buy-ticket-Regular', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { selectedPersons, selectedDate, monuId } = req.body;

  console.log(selectedPersons, selectedDate);

  try {
    const agency = await Agency.findOne({ _id: monuId });
    if (!agency) return res.status(404).json({ msg: 'Event not found' });
    const persons = parseInt(selectedPersons, 10);
    if (!persons || persons <= 0) {
      return res.status(400).json({ msg: 'Invalid number of persons' });
    }
    if (agency.totalAvailableTicket < persons) {
      return res.status(400).json({ msg: 'Not enough tickets available' });
    }
    const parsedDate = dateToTimestamp(selectedDate);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ msg: 'Invalid selected date' });
    }
    const tickets = [];
    const tick = [];

    for (let i = 0; i < persons; i++) {
      const ticketNo = crypto.randomBytes(8).toString('hex');
      const expirationDate = (parsedDate + 24 * 60 * 60 * 1000);
      const ticket = new Ticket({
        ticketNo: ticketNo,
        MonumentId: monuId,
        userId: userId,
        price: agency.ticketPrice,
        purchasedAt: Date.now(),
        ExpirationDate: expirationDate,
        selectedDate: parsedDate
      });

      await ticket.save();
      tickets.push(ticket._id);
      tick.push(ticket);
    }

    await User.updateOne(
      { _id: userId },
      { $push: { myTickets: { $each: tickets } } }
    );

    await Agency.updateOne(
      { _id: monuId },
      { $push: { tickets: { $each: tickets } } }
    );

    const user = await User.findOne({ _id: userId })
    await Agency.findByIdAndUpdate(
      monuId,
      { $inc: { totalAvailableTicket: -persons } },
      { new: true }
    );

      await handleIncrementRevenue(selectedDate,persons,agency.ticketPrice,monuId);
      console.log(agency.timing,user.name)
  
      res.status(201).json({ msg: `${persons} tickets purchased successfully`, tickets: tick,time:agency.timing,name:user.name });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  });
  


  // app.post('/gateway/payForTicket', createOrder);

  const Razorpay = require('razorpay');

  app.post('/gateway/orders',authenticateToken, async(req, res) => {
    try {
    const userId=req.user.userId;
    const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY
    })

    const {amount,Currency,id}=req.body;
    console.log(amount," ",typeof amount)
    const options = {
        amount: amount,
        currency: 'INR',
        receipt: `order_rcptid_${new Date().getTime()}`,
        payment_capture: 1
    }

        let user = await User.findOne({ _id:userId });
        let monu=await Agency.findOne({ _id:id });

    
        let prod_name=`${monu.MonumentName} ticket`
      
      
        const response = await razorpay.orders.create(options)

        res.json({
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,
            success: true,
            msg: 'Ticket Created',
            
            key_id: process.env.RAZORPAY_ID_KEY,
            product_name: prod_name,
            description: monu.desc,
            name: user.name,
            email: user.email
        })
    } catch (error) {
      console.log(error)
        res.status(500).send("Internal server error")
    }
})

app.get("/gateway/payment/:paymentId",authenticateToken, async(req, res) => {
    const {paymentId} = req.params;

    const razorpay = new Razorpay({
         key_id: process.env.RAZORPAY_ID_KEY,
         key_secret: process.env.RAZORPAY_SECRET_KEY
    })
    
    try {
        const payment = await razorpay.payments.fetch(paymentId)

        if (!payment){
            return res.status(500).json("Error at razorpay loading")
        }

        res.json({
            status: payment.status,
            method: payment.method,
            amount: payment.amount,
            currency: payment.currency
        })
    } catch(error) {
      console.log(error)
        res.status(500).json("failed to fetch")
    }
})

app.post('/getMonument',  async (req, res) => {
  const monuId = req.body.productId;
  console.log(req.body.monuId)
  
  try {
    const productData = await Agency.findOne({ _id: monuId }).select('-password');
    if (!productData) return res.status(404).json({ msg: 'Event not found' });
   
    
      res.status(201).json({productData});
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  });

app.use('/api/auth', authRoutes);
app.use('/api/agency', Monument);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});