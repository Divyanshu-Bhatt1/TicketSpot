import React, { useState } from 'react';
import axios from 'axios';

const ProductPayment = () => {
  const [products] = useState([
    {
      name: 'Shirt',
      image: 'https://cdn.pixabay.com/photo/2014/04/03/10/55/t-shirt-311732_960_720.png',
      amount: 500,
      description: 'Shirt Buying',
    },
    {
      name: 'Shoes',
      image: 'https://cdn.pixabay.com/photo/2013/07/12/18/20/shoes-153310_960_720.png',
      amount: 1500,
      description: 'Shoes Buying',
    },
  ]);

  const handlePayment = (product) => {
    // Prepare data to be sent to backend
    const data = {
      name: product.name,
      amount: product.amount,
      description: product.description,
    };

    // Call backend to create Razorpay order
    axios.post('/createOrder', data)
      .then((res) => {
        if (res.data.success) {
          const options = {
            key: res.data.key_id,
            amount: res.data.amount,
            currency: 'INR',
            name: res.data.product_name,
            description: res.data.description,
            image: 'https://dummyimage.com/600x400/000/fff',
            order_id: res.data.order_id,
            handler: function (response) {
              alert('Payment Succeeded');
              // Optionally redirect or update UI
            },
            prefill: {
              contact: res.data.contact,
              name: res.data.name,
              email: res.data.email,
            },
            notes: {
              description: res.data.description,
            },
            theme: {
              color: '#2300a3',
            },
          };
          const razorpayObject = new window.Razorpay(options);
          razorpayObject.on('payment.failed', function (response) {
            alert('Payment Failed');
          });
          razorpayObject.open();
        } else {
          alert(res.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error in payment:', error);
        alert('An error occurred, please try again.');
      });
  };

  return (
    <div>
      <h1>Razorpay Web-Integration</h1>
      <div style={{ display: 'inline-block', margin: '20px' }}>
        {products.map((product) => (
          <div key={product.name}>
            <img src={product.image} alt={product.name} width="100px" height="100px" />
            <p>{product.name}</p>
            <p><b>Amount: ₹{product.amount}</b></p>
            <button onClick={() => handlePayment(product)}>Pay Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPayment;
