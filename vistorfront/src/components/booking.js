import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BotIcon, X, Send, Home, Info, Calendar, Users, User, Mic } from 'lucide-react';
import axios from "axios";
import './css/Chatbot.css';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { saveAs } from 'file-saver';
import QRCode from 'qrcode';

const buttonColors = ['#4CAF50', '#2196F3', '#FFC107', '#E91E63', '#9C27B0'];

const IconButton = ({ icon: Icon, label, onClick }) => (
  <motion.button
    className="icon-button"
    onClick={onClick}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    <Icon size={20} />
    <span>{label}</span>
  </motion.button>
);

const LoadMoreButton = ({ onClick }) => (
  <motion.button
    className="load-more-button"
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    Load More
  </motion.button>
);

export default function Booking({productData}) {

  const [responseId, setResponseId] = React.useState("");
  const [responseState, setResponseState] = React.useState([]);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");

      script.src = src;

      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }

      document.body.appendChild(script);
    })
  }

  









  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [disableInp,setDisableInp]=useState();
  const [lang,setLang]=useState('English')
  const [step,setStep]=useState(0);

  const handleDisableInp=()=>{
    setDisableInp(!disableInp)
  }
 


  useEffect(() => {
    console.log(messages," ",isOpen)
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true); // Set isOpen to true after 3 seconds
    }, 3000);
  
    return () => clearTimeout(timer); // Clean up the timer when the component is unmounted or useEffect runs again
  }, []);
  
  const addBotMessage = (input) => {
    setMessages((prev) => {
      const newMessage = { sender: 'bot' };
  
      // Handle button messages
      if (typeof input === 'object' && input.type === 'button') {
        newMessage.type = 'button';
        newMessage.buttons = input.buttons.map((button) => ({
          label: button.label || 'Button',
          onClick: button.onClick || (() => {}),
          className: button.className || 'default-button-class',
          disabled: false,
        }));
      } 
      // Handle event card messages
      else if (typeof input === 'object' && input.type === 'eventCard') {
        newMessage.type = 'eventCard';
        newMessage.events = input.events.map((event) => ({
          eventName: event.eventName,
          eventTicketPrice: event.eventTicketPrice,
          eventTime: event.eventTime,
          onClick: event.onClick || (() => {}),
          className: event.className || 'event-card',
        }));
      } 
      // Handle text messages
      else if (typeof input === 'string') {
        newMessage.text = input;
      } 
      // Fallback for unexpected input
      else {
        console.error('Invalid input for addBotMessage:', input);
        return prev;
      }
  
      return [...prev, newMessage];
    });
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { text, sender: 'user' }]);
  };


  const disablePrevButtons=(className)=>{
    setMessages((prevMessages) =>
      prevMessages.map((msg) => {
        if (msg.buttons) {
          msg.buttons = msg.buttons.map((btn) => {
            if (btn.className === className) {
              return { ...btn, disabled: true }; // Disable buttons with matching class name
            }
            return btn;
          });
        }
        return msg;
      })
    );
  }

  const disablePrevDivs = (className) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => {
        if (msg.events) {
          msg.events = msg.events.map((event) => {
            if (event.className === className) {
              return { ...event, disabled: true }; // Disable divs with matching class name
            }
            return event;
          });
        }
        return msg;
      })
    );
  };

  const handleCloseChatbot=()=>{
    setIsOpen(false)
    setMessages([])
    setStep(0)
  }


  // flow Controller
  useEffect(()=>{
    console.log(lang)

    switch (step) {
      case 1:
        proceedYesOrNo();
          break;
      case 2:
          stepTwo();
          break;
      case 3:
           stepThree();
          break;
      case 4:
           stepBeforeCoupon();
           break;  
      case 5:
           stepToGetCoupon();
           break;
      case 6:
            stepSix()
            break;
      default:
          console.log('Unknown action');
  }
    // proceedYesOrNo()
  },[step])
  


// step 0
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      handleDisableInp()
      addBotMessage(`Welcome to ${productData.MonumentName}! Please choose your preferred language to get started. 😊`)
      addBotMessage({
        type: 'button',
        buttons: [
          {
            label: 'English',
            className: 'lang-button',
            onClick: () => handleLanguage('en','lang-button','English'),
          },
          {
            label: 'हिन्दी',
            className: 'lang-button',
            onClick: () => handleLanguage('hi','lang-button','हिन्दी'),
          },
          {
            label: 'தமிழ்',
            className: 'lang-button',
            onClick: () => handleLanguage('ta','lang-button','தமிழ்'),
          },
        ],
      });
    }
      
  }, [isOpen]);


  
 


  const handleLanguage=(data,className,label)=>{
    setStep((prevVal)=>prevVal+1)
    console.log(data,"handleLang")
    setLang(data)
    addUserMessage(label)
    
    disablePrevButtons(className)
  }


  // step 1

  const proceedYesOrNo = async() => {
    addBotMessage(await handleTranslation(`Would you like to book a ticket for ${productData.MonumentName}?`))
    addBotMessage({
      type: 'button',
      buttons: [
        {
          label: await handleTranslation('Yes'),
          className: 'proceed-button',
          onClick: () => handleResponse('Yes','proceed-button'),
        },
        {
          label:await handleTranslation('No'),
          className: 'lang-button',
          onClick: () => handleCloseChatbot(),
        },
      ],
    });
  };
 

  const handleTranslation = async (text) => {
    // alert(lang)
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/translate`, {
        params: {
          text: text,
          lang: lang,
        },
      });
      return (response.data.translatedText);
    } catch (error) {
      console.error("Error during translation:", error);
    }
  };


  
  const handleResponse = async(data,className) => {
    addUserMessage( await handleTranslation(data))
    if(data==='Yes')
    {
      setStep((prevVal)=>prevVal+1)
      disablePrevButtons(className)
    }
    

  };


  // step 2


  const stepTwo=async()=>{
    const dateButtons = getNextFourDates().map((dateObj) => ({
      label: dateObj.displayDate, // Show "DD-MM-YYYY" as label
      className: 'date-button',
      onClick: () => handleDateSelection(dateObj.displayDate,dateObj.isoDate,'date-button'), // Pass ISO format to the handler
  }));

  
  addBotMessage(await handleTranslation(`Which date would you like to explore? Choose from the available options below!`))
  addBotMessage({
    type: 'button',
    buttons: dateButtons,
});
     
  }


  function getNextFourDates() {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 5; i++) { // Current date + next 4 dates
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        // Format the date as "YYYY-MM-DDTHH:mm:ss.sssZ" for database use
        const isoDate = date.toISOString();

        // Format the date as "DD-MM-YYYY" for label display
        const displayDate = date.toLocaleDateString('en-GB'); // Example: 07-12-2024

        dates.push({ isoDate, displayDate });
    }

    return dates;
}

const [selectDate,setSelectDate]=useState(null)
async function handleDateSelection(selectedDate,isoDate,className) {
    console.log('Selected Date in ISO Format:', isoDate);
    disablePrevButtons(className)
    addUserMessage(selectedDate)
    setSelectDate(selectedDate)
    try {
      const data={
          date: isoDate,
          lang: lang,
          id:productData._id
      }
      const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/api/getEventOrRegular`,data, {
         withCredentials:true
      });

      console.log(response.data.events)

      if (response.data.events.length === 0) {
        // The events array is empty
        addBotMessage(response.data.soldOutMsg);
        setTimeout(() => {
          handleCloseChatbot() // Set isOpen to true after 3 seconds
        }, 3000);
      }else{

      const eventsWithAdditionalProps = response.data.events.map((event, index) => ({
        ...event, // Spread existing properties
        className: 'small-event-card', // Add className
        onClick: () => handleParticularEvent(event.evId,event.eventName,'small-event-card',event.enName,event.eventTotalTicketsAvailable,event.ticketPrice), // Add onClick handler
      }));

      addBotMessage({
       type: 'eventCard',
       events: eventsWithAdditionalProps,
});
      }
      // return (response.data.events);
    } catch (error) {
      console.error("Error during translation:", error);
    }
    
}

const [isMonu,setIsMonu]=useState(false)
const [lastId,setLastId]=useState('')
const [ticketAvaliable,setTicketAvailable]=useState(0)
const [ticketPrice,setTicketPrice]=useState(0)

const handleParticularEvent=(id,evName,className,enName,eventTotalTicketsAvailable,ticketPrice)=>{
  setTicketAvailable(eventTotalTicketsAvailable)
  setTicketPrice(ticketPrice)
  setLastId(id)
  if(enName==='Regular Visit')
  {
    setIsMonu(true)
  }
  disablePrevDivs(className)
  addUserMessage(evName)
  setStep((prevVal)=>prevVal+1)

}

// step 3

const stepThree=async()=>{
  addBotMessage(await handleTranslation(`How many tickets do you want to book?`))
  if(ticketAvaliable<=10)
  {
  addBotMessage(await handleTranslation(`There are ${ticketAvaliable} tickets left.`))
  }
 
  // Call the function to generate the buttons
  createTicketButtons();
}

const createTicketButtons = async () => {
  const buttons = [];

  // Loop through numbers 1 to 5 and create buttons
  if(ticketAvaliable>5){
  for (let i = 1; i <= 5; i++) {
    const label = i.toString(); // Translate the number to a string (or any other translation logic)
    
    buttons.push({
      label: label.text || i.toString(),  // Use translated label or fallback to number
      className: 'ticket-count-button',
      onClick: () => handleTicketResponse(i, 'ticket-count-button'),  // Pass the number as part of the response
    });
  }
}else{
  for (let i = 1; i <= ticketAvaliable; i++) {
    const label = i.toString(); // Translate the number to a string (or any other translation logic)
    
    buttons.push({
      label: label.text || i.toString(),  // Use translated label or fallback to number
      className: 'ticket-count-button',
      onClick: () => handleTicketResponse(i, 'ticket-count-button'),  // Pass the number as part of the response
    });
  }
}

  // Add the buttons to the bot message
  addBotMessage({
    type: 'button',
    buttons: buttons,
  });
};

const [ticketCount,setTicketCount]=useState(0)
const handleTicketResponse=(cnt,className)=>{
   setTicketCount(cnt)
   disablePrevButtons(className)
   addUserMessage(cnt)
   setStep((prevVal)=>prevVal+1)
}


const stepBeforeCoupon=async()=>{
  let totalCost=ticketCount*ticketPrice;
  addBotMessage(await handleTranslation(`You want to book ${ticketCount} tickets. The total price is ₹${totalCost}.`));
  addBotMessage(await handleTranslation(`Do you want to apply a coupon if yes then hit yes else no`))
  addBotMessage({
    type: 'button',
    buttons: [
      {
        label: await handleTranslation('Yes'),
        className: 'confirm-Coupon-button',
        onClick: () => handleBeforeCoupon('Yes','confirm-Coupon-button'),
        // onClick:()=>createRazorpayOrder()
      },
      {
        label:await handleTranslation('cancel'),
        className: 'confirm-Coupon-button',
        onClick: () => handleBeforeCoupon('No','confirm-Coupon-button'),
      },
    ],
  });
}

const handleBeforeCoupon = async(data,className) => {
  addUserMessage( await handleTranslation(data))
  if(data==='Yes')
  {
    setStep((prevVal)=>prevVal+1)
    disablePrevButtons(className)
  }else{
    setStep(6)
    disablePrevButtons(className)
  }
}

const [coup,setCoup]=useState(false)
const [discount,setDiscount]=useState(0)
const [couponId,setCouponId]=useState(null)
const stepToGetCoupon=async()=>{
  setDisableInp(true)
  setCoup(true)
  // let totalCost=ticketCount*ticketPrice;
  addBotMessage(await handleTranslation(`Please enter your coupon code`))
//   const data={
//     couponCode:input,
//     totalCost:totalCost
//   }
//   try{
//   const response = await axios.post(
//     `${process.env.REACT_APP_BACK_URL}/api/auth/match-coupon`,
//     data,
//     {
//       withCredentials: true, // Ensure cookies are sent with the request
//     }
//   );
//   // Handle success response
//   if(response.status===201){
//   alert('Coupon applied successfully:');
//   setDiscount(response.data.couponDiscountPrice)
//   setCouponId(response.data.couponId);
//   setDisableInp(false)
//   setCoup(false)
//   setStep((prevStep)=>prevStep+1)
//   }
// } catch (error) {
//   // Handle error response
//   // if (error.response) {
//   //   // Server-side error (e.g., 400, 404, 500)
//   //   console.error('Error from server:', error.response.data.error);
//   // } else {
//   //   // Client-side error or network issues
//   //   console.error('Error connecting to server:', error.message);
//   // }
//   if(error.response.data.message){
//   alert(error.response.data.message) 
//   }
//   setStep(4)
// }
}


// step 4

const handleInputCouponSubmit = async(e) => {

  if (e.key === 'Enter') {
  console.log('handleInputCouponSubmit')
  console.log(input ,'h')
  // if (input!='') {
  //   setError('Please enter a message.');
  //   return;
  // }
  // setError('');
  console.log(input ,'h')
  addUserMessage(input);
  // setStep((prevStep)=>prevStep+1)
  let totalCost=ticketCount*ticketPrice;
  const data={
    couponCode:input,
    totalCost:totalCost
  }
  try{
  const response = await axios.post(
    `${process.env.REACT_APP_BACK_URL}/api/auth/match-coupon`,
    data,
    {
      withCredentials: true, // Ensure cookies are sent with the request
    }
  );
  // Handle success response
  if(response.status===200){
  alert('Coupon applied successfully:');
  setDiscount(response.data.couponDiscountPrice)
  setCouponId(response.data.couponId);
  setDisableInp(false)
  setCoup(false)
  setStep((prevStep)=>prevStep+1)
  }
  console.log(response)
} catch (error) {
  // Handle error response
  // if (error.response) {
  //   // Server-side error (e.g., 400, 404, 500)
  //   console.error('Error from server:', error.response.data.error);
  // } else {
  //   // Client-side error or network issues
  //   console.error('Error connecting to server:', error.message);
  // }
  console.log(error)
  if(error.response.data.message){
  alert(error.response.data.message) 
  }
  setStep(4)
}
  }
};

const stepSix=async()=>{
  
  let totalCost=(ticketCount*ticketPrice)-discount;
  addBotMessage(await handleTranslation(`You want to book ${ticketCount} tickets. The total price is ₹${totalCost}.`));
  addBotMessage(await handleTranslation(`Please confirm your booking by choosing "Pay Now" or "cancel" button`))
  addBotMessage({
    type: 'button',
    buttons: [
      {
        label: await handleTranslation('Pay Now'),
        className: 'confirm-book-button',
        // onClick: () => handleConfirmationResponse(),
        onClick:()=>createRazorpayOrder()
      },
      {
        label:await handleTranslation('cancel'),
        className: 'confirm-book-button',
        onClick: () => handleCloseChatbot(),
      },
    ],
  });
}

const createRazorpayOrder = () => {
 
  
  let totalCost=(ticketCount*ticketPrice)-discount;
  let data = JSON.stringify({
    amount: totalCost * 100,
    currency: "INR",
    id:productData._id
  })

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${process.env.REACT_APP_BACK_URL}/gateway/orders`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: data,
    withCredentials: true 
  }

  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data))
    if(response.data.success)
    {
    handleRazorpayScreen(response)
    }else{
      handleCloseChatbot()
    }
  })
  .catch((error) => {
    console.log("error at", error)
  })
}

const handleRazorpayScreen = async(response) => {
  const { key_id, amount, product_name, description, order_id, name, email } = response.data;
  const res = await loadScript("https:/checkout.razorpay.com/v1/checkout.js")

  if (!res) {
    alert("Some error at razorpay screen loading")
    return;
  }

  const options = {
    key: key_id,
    amount: amount,
    currency: 'INR',
    name: product_name,
    description: `payment to ${productData.MonumentName}`,
    image:`${productData.MonumentLogo}`,
    handler: function (response){
      setResponseId(response.razorpay_payment_id)
      disablePrevButtons('proceed-button')
      paymentFetch(response.razorpay_payment_id)
    },
    prefill: {
      name: "TicketSpot",
      email: "codex.2420@gmail.com"
    },
    theme: {
      color: "#F4C430"
    }
  }

  const paymentObject = new window.Razorpay(options)
  paymentObject.open()
}

const paymentFetch = (data) => {
  // e.preventDefault();

  const paymentId =data;
  console.log(data)

  axios.get(`${process.env.REACT_APP_BACK_URL}/gateway/payment/${paymentId}`,{withCredentials: true })
  .then((response) => {
    console.log(response.data);
    setResponseState(response.data)
    if(response.status)
    {
      handleConfirmationResponse()
    }else{
      handleCloseChatbot()
    }
  })
  .catch((error) => {
    console.log("error occures", error)
  })
}


// const handlePayment = async () => {
//   disablePrevButtons('proceed-button')
//   let totalCost=ticketCount*ticketPrice;
//   try {
//     // Call the API to create the order
//     const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/gateway/payForTicket`, {
//       amount: totalCost,
//       id:productData._id
//       // name: product.name,
//       // description: product.description
//     },{withCredentials:true});

//     if (response.data.success) {
//       const { key_id, amount, product_name, description, order_id, name, email } = response.data;
//       console.log(amount," ",typeof amount,key_id)
//       // Razorpay checkout options

//       const options = {
//         key: key_id,
//         amount: amount,
//         currency: 'INR',
//         name: product_name,
//         description: description,
//         order_id: order_id,
//         handler: function (response) {
//           alert('Payment Successful');
//           handleConfirmationResponse()
//           // Redirect or update UI after successful payment
//         },
//         prefill: {
//           // contact: "1234567891",
//           name: name,
//           email: email
//         },
//         notes: {
//           description: description
//         },
//         theme: {
//           color: '#2300a3'
//         }
//       };

//       // Open Razorpay payment window
//       const razorpayObject = new window.Razorpay(options);
//       razorpayObject.open();
      
//       razorpayObject.on('payment.failed', function (response) {
//         alert('Payment Failed');
//         handleCloseChatbot()
//       });
//     } else {
//       alert(response.data.msg);
//     }
//   } catch (error) {
//     console.error(error);
//     alert('Payment API call failed');
//     handleCloseChatbot()
//   }
// };


const  handleConfirmationResponse=async()=>{
  // alert(isMonu)
  if(isMonu){
  handleMonu()
  }else{
    handleEvent()
  }
  addBotMessage(await handleTranslation(`Booking confirmed`))
  addBotMessage(await handleTranslation(`Enjoy your visit , and don't forget to give review`))
}

const [tickets,setTickets]=useState(null)
const handleMonu=async()=>{
  try{
  const response = await axios.post(
    `${process.env.REACT_APP_BACK_URL}/api/buy-ticket-Regular`,
    {
        place:productData.MonumentName,
        selectedPersons: ticketCount,
        selectedDate: selectDate,
        monuId:productData._id,
        couponId:couponId

    },
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }
  );
  console.log('Booking confirmed:', response.data);
  setTickets(response.data.tickets)
  
  

  response.data.tickets.forEach((ticket) => {
    createTicketPDF(ticket,response.data.time,response.data.name); // Generate PDF for each ticket
  });

  handleCloseChatbot()
} catch (error) {
  console.error('Error booking ticket:', error.message);
}
}



const handleEvent=async()=>{
  try{
    const response = await axios.post(
      `${process.env.REACT_APP_BACK_URL}/api/buy-ticket-Event`,
      { 
        place:productData.MonumentName,
        eventid:lastId ,
        selectedPersons: ticketCount,
        selectedDate: selectDate,
        monuId:productData._id,
        couponId:couponId
      },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    console.log('Booking confirmed:', response.data.tickets);
    setTickets(response.data.tickets)
    
    console.log(response.data)
  
    response.data.tickets.forEach((ticket) => {
      createTicketPDF(ticket,response.data.time,response.data.name); // Generate PDF for each ticket
    });

    

    setTime(response.data.time)
    setName(response.data.name)
  
    handleCloseChatbot()
  } catch (error) {
    console.error('Error booking ticket:', error.message);
  }
}

const [time,setTime]=useState('')
const [name,setName]=useState('')

const createTicketPDF = async (ticketData,t,n) => {
  // Fetch the existing PDF document from the public folder
  const pdfUrl = '/assets/document.pdf'; // Path to your PDF in the public folder
  const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());

  // Load the existing PDF
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Get the first page of the document
  const page = pdfDoc.getPages()[0];
  const { width, height } = page.getSize();

  // Generate the QR code as a data URL (base64 image string) with black color
  const qrCodeDataUrl = await QRCode.toDataURL(`${ticketData._id}`, {
    color: {
      dark: '#000000', // Black color for QR code foreground
      light: '#e8c37c', // White background
    },
  });

  // Embed the generated QR code image into the PDF (using PNG method)
  const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);  // Use embedPng for QR code image
  const qrImageDims = qrImage.scale(1);  // Increase the scale for larger QR code
  const qrWidth = 80;  // Set your desired width here
  const qrHeight = 80;  // Set your desired height here

  // Add the QR code to the page at a specific position
  page.drawImage(qrImage, {
    x: 195,  // X position on the page (near the right)
    y: height - 170,  // Y position on the page (near the top)
    width: qrWidth,
    height: qrHeight,
  });

  const date=timestampToDate(ticketData.selectedDate)

  page.drawText(`${ticketData.ticketNo}`, { x:40, y: height -118, size: 12,color: rgb(104 / 255, 28 / 255, 12 / 255) ,rotate: degrees(90) });
  page.drawText(`${ticketData.ticketNo}`, { x: width - 150, y: height -24, size: 12,color: rgb(104 / 255, 28 / 255, 12 / 255)  });
  page.drawText(`${n}`, { x: width - 137, y:height-45, size: 10,color: rgb(104 / 255, 28 / 255, 12 / 255)  });
  page.drawText(`${date}`, { x: width - 150, y: height - 73, size: 10,color: rgb(104 / 255, 28 / 255, 12 / 255)  });
  page.drawText(`${t}`, { x: width - 155, y: height - 100, size: 10,color: rgb(104 / 255, 28 / 255, 12 / 255)  });
  page.drawText(`Rs. ${ticketData.price}`, { x: width - 152, y: height - 125, size: 10,color: rgb(104 / 255, 28 / 255, 12 / 255)  });
  page.drawText(`${productData.MonumentName}`, { x: width - 126, y: height - 152, size: 10,color: rgb(104 / 255, 28 / 255, 12 / 255)  });


  // Save the modified PDF
  const pdfBytes = await pdfDoc.save();

  // Trigger the download of the modified PDF
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, 'ticket.pdf');
};

const timestampToDate = (timestamp) => {
  // Create a Date object from the timestamp
  const date = new Date(timestamp);

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, '0'); // Ensure two-digit format
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();

  // Return formatted date
  return `${day}/${month}/${year}`;
};


// const createTicketPDF = async (ticket) => {
//   console.log(ticket,"hello")
//   // Create a new PDF document
//   const pdfDoc = await PDFDocument.create();
  
//   // Add a blank page
//   const page = pdfDoc.addPage([600, 400]);
  
//   // Draw a rectangle for the ticket background
//   page.drawRectangle({
//     x: 50,
//     y: 50,
//     width: 500,
//     height: 300,
//     color: rgb(0.9, 0.9, 0.9), // Light grey background
//   });
  
//   // Set the font size and color
//   const fontSize = 20;
  
//   // Add ticket details to the PDF
//   page.drawText(`Monument Name: ${productData.MonumentName}`, { x: 60, y: 370, size: fontSize, color: rgb(0, 0, 0) });
//   page.drawText(`Ticket No: ${ticket.ticketNo}`, { x: 60, y: 320, size: fontSize, color: rgb(0, 0, 0) });
//   page.drawText(`Event ID: ${ticket?.eventId||''}`, { x: 60, y: 290, size: fontSize, color: rgb(0, 0, 0) });
//   page.drawText(`User ID: ${ticket.userId}`, { x: 60, y: 260, size: fontSize, color: rgb(0, 0, 0) });
//   page.drawText(`Price: Rs.${ticket.price}`, { x: 60, y: 230, size: fontSize, color: rgb(0, 0, 0) });
//   page.drawText(`Purchased At: ${ticket.purchasedAt.toLocaleString()}`, { x: 60, y: 200, size: fontSize, color: rgb(0, 0, 0) });
//   page.drawText(`Expiration Date: ${ticket.ExpirationDate.toLocaleString()}`, { x: 60, y: 170, size: fontSize, color: rgb(0, 0, 0) });
//   page.drawText(`Selected Date: ${ticket.selectedDate.toLocaleString()}`, { x: 60, y: 140, size: fontSize, color: rgb(0, 0, 0) });
  
//   // Serialize the PDFDocument to bytes (a Uint8Array)
//   const pdfBytes = await pdfDoc.save();
  
//   // Create a Blob from the PDF bytes
//   const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  
//   // Create a link element to download the PDF
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = `ticket_${ticket.ticketNo}.pdf`;
  
//   // Append link to the body and click it to trigger the download
//   document.body.appendChild(link);
//   link.click();
  
//   // Clean up the link element
//   document.body.removeChild(link);
// };



// const sendDataToServer = async (place, date, persons) => {
//   try {
//     console.log(date,
//       place,
//       eventId ,
//        persons,
//       )
  //   const response = await axios.post(
  //     `${process.env.REACT_APP_BACK_URL}/api/auth/buy-ticket`,
  //     {
  //       date,
  //       place,
  //       eventid:eventId ,
  //       selectedPersons: persons,
  //       selectedDate: new Date(date).getTime(),
  //     },
  //     {
  //       headers: { 'Content-Type': 'application/json' },
  //       withCredentials: true,
  //     }
  //   );
  //   console.log('Booking confirmed:', response.data.tickets);
  //   setTickets(response.data.tickets)
    
    

  //   response.data.tickets.forEach((ticket) => {
  //     createTicketPDF(ticket); // Generate PDF for each ticket
  //   });

  //   handleCloseChatbot()
  // } catch (error) {
  //   console.error('Error booking ticket:', error.message);
  // }
// };
 





  const fetchApiResponse = async (input) => {
    addBotMessage(<div className="bot-typing">Thinking<span>.</span><span>.</span><span>.</span></div>);
    try {
      const response = await fetch('https://dialogflow.googleapis.com/v2/projects/ticketspot-omya/agent/sessions/57a7df7e-9458-c675-313b-38d6a2351168:detectIntent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ya29.a0AeDClZCcs78pOvDkDp2yFplfrhG9_l3-Cap5GpkZomdtuz2AhcPnn5alyyEBlwuhgBHoBaXa7fvYx-zG0NEFRWrIEEYeuWi1RICZ07wnMQqAvc_jfxvZH8eWgNy3XmCPcSWTm1-xcAwB3DWL5zq6nLNtOSPo2QfK-Rt9SfgT3g24a2tWIZrCLW4sF2MtKYJ_MtF3W_oEJATpc8nj2l9DjVw5JOfymY0Rl6U7xLWN6AtOkRPwVlXNImKMW5xQqp-KZIFE_6YVtEQ9JO7iUjV8bmjVw7Kh_WbWy6scYSygne6JmGzk9uBuvCpE5ucn7upXc9P-Bx8EiDKWVhvqlsNCUsDyxWXoUI02udDOzS33mne4bjLL7lC_YanBw20ISvRfwYZNDQTmjWS3CRXdVb8p-jrE6aHvKSqcFvgTzudLqRAPeQaCgYKARASARMSFQHGX2MiPgy68-XWGJyCUspJKXANRg0437`,
        },
        body: JSON.stringify({
          queryInput: {
            text: {
              text: input,
              languageCode: 'en',
            },
          },
          queryParams: {
            source: 'DIALOGFLOW_CONSOLE',
            timeZone: 'Asia/Calcutta',
          },
        }),
      });
      const data = await response.json();

      setMessages((prev) => prev.slice(0, -1));

      if (data.queryResult) {
        const Intent = data.queryResult.intent.displayName;
        console.log(Intent);

        switch (Intent) {
          case "greeting":

            break;

          case "family_events":
            try {
              const res = await axios.get("http://localhost:5000/fetchmuseumfamilyevents");
              console.log("Res", res);
              res.data.forEach((event) => {
                const { MonumentName, MonumentId } = event.monument;
                addBotMessage(
                  <button
                    onClick={() => window.location.href = `http://localhost:3000/${MonumentId}`}
                    className="redirect-button"
                  >
                    Visit {MonumentName}
                  </button>
                );
              });
            } catch (error) {
              console.error("Error fetching family events:", error);
              addBotMessage("Sorry, I couldn't fetch the family events at the moment.");
            }
            break;
          case "family_events_tamil":
            try {
              const res = await axios.get("http://localhost:5000/fetchmuseumfamilyevents");
              console.log("Res", res);
              res.data.forEach((event) => {
                const { MonumentNameTamil, MonumentId } = event.monument;
                addBotMessage(
                  <button
                    onClick={() => window.location.href = `http://localhost:3000/${MonumentId}`}
                    className="redirect-button"
                  >
                    Visit {MonumentNameTamil}
                  </button>
                );
              });
            } catch (error) {
              console.error("Error fetching family events:", error);
              addBotMessage("Sorry, I couldn't fetch the family events at the moment.");
            }
            break;
          case "cheap_places_tamil":
            try {
              const res = await axios.get("http://localhost:5000/fetchmuseumcheapplacetamil");
              console.log("Res", res);
              res.data.forEach((event) => {
                const { MonumentNameTamil, _id } = event.monument;

                addBotMessage(
                  <button
                    onClick={() => window.location.href = `http://localhost:3000/${_id}`}
                    className="redirect-button"
                  >
                    Visit {MonumentNameTamil}
                  </button>
                );
              });
            } catch (error) {
              console.error("Error fetching Student events:", error);
              addBotMessage("Sorry, I couldn't fetch the Student events at the moment.");
            }
            break;
          case "solotravel":
            try {
              const res = await axios.get("http://localhost:5000/fetchmuseumSoloevents");
              console.log("Res", res);
              res.data.forEach((event) => {
                const { MonumentName, _id } = event.monument;
                addBotMessage(
                  <button
                    onClick={() => window.location.href = `http://localhost:3000/${_id}`}
                    className="redirect-button"
                  >
                    Visit {MonumentName}
                  </button>
                );
              });
            } catch (error) {
              console.error("Error fetching solo events:", error);
              addBotMessage("Sorry, I couldn't fetch the solo events at the moment.");
            }
            break;
          case "PlaceToVisitIntent":
            const Place = data.queryResult.parameters.place;
            console.log("Place", Place)
            try {
              const res = await axios.get(`http://localhost:5000/fetchmuseumfromplace/${Place}`);
              console.log("Res", res);
              res.data.forEach((event) => {
                const { MonumentName, _id } = event;
                addBotMessage(
                  <button
                    onClick={() => window.location.href = `http://localhost:3000/${_id}`}
                    className="redirect-button"
                  >
                    Visit {MonumentName}
                  </button>
                );
              });
            } catch (error) {
              console.error("Error fetching solo events:", error);
              addBotMessage("Sorry, I couldn't fetch the solo events at the moment.");
            }
            break;
          case "DefaultFallbackIntent":
            try {

              console.log("Hello world");
              const res = await axios.get(`http://localhost:5000/fetchmuseumDefault/`);
              console.log("Res", res);
              res.data.forEach((event) => {
                const { MonumentName, _id } = event;
                addBotMessage(
                  <button
                    onClick={() => window.location.href = `http://localhost:3000/${_id}`}
                    className="redirect-button"
                  >
                    Visit {MonumentName}
                  </button>
                );
              });
            } catch (error) {
              console.error("Error fetching  events:", error);
              addBotMessage("Sorry, I couldn't fetch the events at the moment.");
            }
            break;
          case "student_event_tamil":
            try {
              const res = await axios.get("http://localhost:5000/fetchmuseumStudenteventstamil");
              console.log("Res", res);
              res.data.forEach((event) => {
                const { MonumentNameTamil, _id } = event.monument;
                addBotMessage(
                  <button
                    onClick={() => window.location.href = `http://localhost:3000/${_id}`}
                    className="redirect-button"
                  >
                    Visit {MonumentNameTamil}
                  </button>
                );
              });
            } catch (error) {
              console.error("Error fetching Student events:", error);
              addBotMessage("Sorry, I couldn't fetch the Student events at the moment.");
            }
            break;
          default:
        }

        if (data.queryResult.fulfillmentText) {
          addBotMessage(data.queryResult.fulfillmentText);
        }
      } else {
        addBotMessage('Sorry, I could not understand that.');
      }
    } catch (error) {
      console.error('Error fetching API response:', error);
      addBotMessage('I apologize, but there seems to be a technical issue. Please try again later.');
    }
  };

  const handleInputSubmit = () => {
    console.log('handleinp')
    if (input!=='') {
      setError('Please enter a message.');
      return;
    }
    setError('');
    addUserMessage(input);
    fetchApiResponse(input);
    setInput('');
   
  };

  const handleIconClick = (intent) => {
    fetchApiResponse(intent);
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      console.error('Speech recognition not supported');
      addBotMessage('Speech recognition is not supported in your browser.');
    }
  };

  return (
    <>
      
      <motion.div
        className="chatbot-icon"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <BotIcon size={24} />
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="chatbot-header">
              <div className="chatbot-header-title">
                <BotIcon size={24} className="bot-icon" />
                <h3>MuseumTix Assistant</h3>
              </div>
              <button onClick={() => handleCloseChatbot()}>
                <X size={20} />
              </button>
            </div>
            <div className="chatbot-icons">
              <IconButton icon={Home} label="Home" onClick={() => handleIconClick("greeting")} />
              <IconButton icon={Info} label="Info" onClick={() => handleIconClick("info")} />
              <IconButton icon={Calendar} label="Events" onClick={() => handleIconClick("events")} />
              <IconButton icon={Users} label="Family" onClick={() => handleIconClick("family_events")} />
              <IconButton icon={User} label="Solo" onClick={() => handleIconClick("solotravel")} />
            </div>
            <div className="chatbot-messages">
              <AnimatePresence>
              {messages.map((message, index) => (
  <motion.div
    key={index}
    className={`message ${message.sender}`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
  >
    {/* Render Text Messages */}
    {message.text && <div className="message-text">{message.text}</div>}

    {/* Render Buttons if Present */}
    {message.buttons && (
      <div className="button-container">
        {message.buttons.map((button, buttonIndex) => (
          <motion.button
            key={buttonIndex}
            className={`redirect-button ${button.className || ''}`}
            onClick={button.onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={button.disabled}
          >
            {button.label}
          </motion.button>
        ))}
      </div>
    )}



    {message.events && (
      <div className="event-card-container">
        {message.events.map((event, eventIndex) => (
          <motion.div
            key={eventIndex}
            className={`event-card ${event.className || ''} ${
              event.disabled ? 'disabled' : ''
            }`}
            onClick={() => {
              if (!event.disabled) {
                event.onClick();
              }
            }}
            style={{ cursor: event.disabled ? 'not-allowed' : 'pointer' }}
            whileHover={!event.disabled ? { scale: 1.05 } : {}}
            whileTap={!event.disabled ? { scale: 0.95 } : {}}
          >
            <h4>{event.eventName}</h4>
            <p>{event.eventTicketPrice}</p>
            <p>{event.eventTime}</p>
          </motion.div>
        ))}
      </div>
    )}
  </motion.div>
))}

              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
            <div className="chatbot-input">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => (e.key === 'Enter' && coup) ? handleInputCouponSubmit(e): handleInputSubmit()}
                placeholder="Type your message here..."
                // disabled={(coup||disableInp)}
              />        


              <motion.button
                onClick={handleVoiceInput}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`voice-input-button ${isListening ? 'listening' : ''}`}
                // disabled={coup||disableInp}
              >
                <Mic size={20} />
              </motion.button>
              <motion.button
                onClick={handleInputSubmit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                // disabled={coup||disableInp}
              >
                <Send size={20} />
              </motion.button>
            </div>
            {error && <p className="error">{error}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}