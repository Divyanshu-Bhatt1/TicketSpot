// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';

// const useAuth = () => {
//   const [authenticated, setAuthenticated] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {

        
      
//         const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/agency/agencydetails`, {
          
//           withCredentials: true // Ensure cookies are sent with the request
//         });

//         console.log(response)

//         if (response.status === 200) {
//           setAuthenticated(true);
//         } else {
//           setAuthenticated(false);
//         }
//       } catch (error) {
//         console.error('Authentication error:', error);
//         setAuthenticated(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   return { authenticated, loading };
// };

// export default useAuth;


import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = Cookies.get('token'); // Extract token from cookies
        console.log("token: ", token);
        
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/agency/agencydetails`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in the Authorization header
            'Content-Type': 'application/json' // Include Content-Type header
          },
          withCredentials: true // Ensure cookies are sent with the request
        });

        if (response.status === 200) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { authenticated, loading };
};

export default useAuth;
