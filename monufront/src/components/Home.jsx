// import React, { useEffect, useState } from 'react';
// import { Pie, Bar } from 'react-chartjs-2';
// import axios from 'axios';
// import 'chart.js/auto'; // Required for chart.js
// import './css/home.css';
// import Navbar from './Navbar';

// const HomePage = () => {
//   const [bookingData, setBookingData] = useState([]);

//   useEffect(() => {
//     // Fetch booking data from the server
//     const fetchBookingData = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/agency/fetch-bookings`, { withCredentials: true });
//         setBookingData(response.data.bookings);
//       } catch (error) {
//         console.error('Error fetching booking data:', error);
//       }
//     };

//     fetchBookingData();
//   }, []);

//   // Extract month labels and booking counts from the data
//   const months = bookingData.map((booking) => booking.month);
//   const bookingCounts = bookingData.map((booking) => booking.count);

//   // Data for Pie Chart
//   const pieData = {
//     labels: months,
//     datasets: [
//       {
//         data: bookingCounts,
//         backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
//         hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
//       },
//     ],
//   };

//   // Data for Bar Chart
//   const barData = {
//     labels: months,
//     datasets: [
//       {
//         label: 'Number of Bookings',
//         data: bookingCounts,
//         backgroundColor: 'rgba(75, 192, 192, 0.6)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <div>
//       <Navbar />
//       <div style={{ padding: '20px' }}>
//         <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '40px' }}>Booking Analytics</h1>

//         {/* Conditionally render charts or display message if no data */}
//         {bookingData.length === 0 ? (
//           <div style={{ textAlign: 'center', fontSize: '18px', color: '#888' }}>
//             No bookings available.
//           </div>
//         ) : (
//           <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '50px' }}>
//             {/* Pie Chart */}
//             <div style={{ width: '40%', cursor: 'pointer' }}>
//               <h2 style={{ textAlign: 'center' }}>Bookings Distribution</h2>
//               <Pie data={pieData} />
//             </div>

//             {/* Bar Chart */}
//             <div style={{ width: '40%', cursor: 'pointer' }}>
//               <h2 style={{ textAlign: 'center' }}>Monthly Bookings</h2>
//               <Bar data={barData} />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HomePage;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/home.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HomePage = () => {
  const [bookingData, setBookingData] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [currentMonthBookings, setCurrentMonthBookings] = useState(0);
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/agency/fetch-bookings`, { withCredentials: true });
        setBookingData(response.data.bookings);
      } catch (error) {
        console.error('Error fetching booking data:', error);
      }
    };

    const fetchRevenueAndMonthData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/agency/fetch-revenue`, { withCredentials: true });
        setRevenue(response.data.totalRevenue);
        setCurrentMonthBookings(response.data.bookingCount);
        setCurrentMonthRevenue(response.data.currentMonthRevenue);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchBookingData();
    fetchRevenueAndMonthData();
  }, []);

  const months = bookingData.map((booking) => booking.month);
  const bookingCounts = bookingData.map((booking) => booking.count);
  const revenues = bookingData.map((booking) => booking.monthlyRevenue);

  const combinedData = {};
  for (let i = 0; i < months.length; i++) {
    const month = months[i].substring(5);
    if (!combinedData[month]) {
      combinedData[month] = { bookings: 0, revenue: 0 };
    }
    combinedData[month].bookings += bookingCounts[i];
    combinedData[month].revenue += revenues[i];
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const formattedData = Object.keys(combinedData).map((month) => ({
    name: monthNames[parseInt(month, 10) - 1],
    bookings: combinedData[month].bookings,
    revenue: combinedData[month].revenue,
  }));

  return (
    <div className='main'>
    <div className="homepage-container">
      <h1 className="title">Analytics</h1>
      <p>View ticket sales and revenue analytics</p>

      <div className="stats-card-container">
        <div className="stats-card">
          <h3>Total Revenue</h3>
          <p>{revenue} INR</p>
        </div>
        <div className="stats-card">
          <h3>Bookings This Month</h3>
          <p>{currentMonthBookings}</p>
        </div>
        <div className="stats-card">
          <h3>Revenue This Month</h3>
          <p>{currentMonthRevenue} INR</p>
        </div>
      </div>

      {bookingData.length === 0 ? (
        <div style={{ textAlign: 'center', fontSize: '18px', color: '#888' }}>No bookings available.</div>
      ) : (
        <div className="charts-container">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'Tickets Sold', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Revenue (₹)', angle: -90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="bookings" fill="#8884d8" name="Tickets Sold" />
              <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
    </div>
  );
};

export default HomePage;
