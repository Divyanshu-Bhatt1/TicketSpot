// toastUtils.js
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Success Toast
export const showSuccessToast = (message) => {
  toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000, // Closes after 3 seconds
    theme: 'colored',
  });
};

// Info Toast (e.g., for 'wait for OTP')
export const showInfoToast = (message) => {
  toast.info(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000,
    theme: 'colored',
  });
};

// Danger Toast (e.g., for error messages)
export const showErrorToast = (message) => {
  toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000,
    theme: 'colored',
  });
};
