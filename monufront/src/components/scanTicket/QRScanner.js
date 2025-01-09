// @ts-check

import React, { useState,useEffect } from 'react';
import '../css/QRScanner.css';
import Navbar from '../Navbar.jsx'
import Html5QrcodePlugin from './Html5QrcodePlugin';
import ResultContainerPlugin from './ResultContainerPlugin.js';
import axios from 'axios'

const QRScanner = () => {
    const [decodedResults, setDecodedResults] = useState('');
    const [prevDecodeResults,setPrevDecodeResults]=useState('')
    const onNewScanResult = (decodedText, decodedResult) => {
        // console.log("App [result]", decodedResult," ",decodedText);
        setDecodedResults(decodedText);
    };

    useEffect(()=>{
        console.log(decodedResults," ",prevDecodeResults)
        if(decodedResults!==prevDecodeResults)
        {
            // console.log("hi")
               markTicket(decodedResults)
        }

    },[decodedResults])

    const markTicket=async(data)=>{
        try{
        const response = await axios.post(
            `${process.env.REACT_APP_BACK_URL}/api/agency/ticketScan`,
            { 
              ticketId:data,
            },
            {
              withCredentials: true,
            }
          );
          // alert("You are verified , now you can enjoy your visit , have a great day!")
          console.log(response.data);
          alert(response.data.msg)
          if(response.status===201)
          {
            // console.log(response.data.msg);
            alert("You are verified , now you can enjoy your visit , have a great day!")
            window.location.reload();
          }
          
        } catch (error) {
            if (error.response) {
                // Server responded with a status code other than 2xx
                alert(error.response.data.msg); // Set error message from the server
                window.location.reload();
              } else {
                alert("Something went wrong. Please try again."); // Handle other errors
              }
               // Clear any previous success message
               console.error('Error booking ticket:', error);
            }

            
            setPrevDecodeResults(data)
            // setDecodedResults('')
        }
    

    return (
        <div className="App">
        <Navbar/>
            <section className="App-section">
                <div className="App-section-title">Scan your Tickets</div>
                <br />
                <br />
                <br />
                <Html5QrcodePlugin
                    fps={10}
                    qrbox={350}
                    disableFlip={false}
                    qrCodeSuccessCallback={onNewScanResult}
                />
                {/* <ResultContainerPlugin results={decodedResults} /> */}
                
            </section>
        </div>
    );
};

export default QRScanner;

// @ts-check
