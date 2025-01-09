// ProductList.js
import React from 'react';

const ProductList = ({ products }) => {
  return (
    <div className="product-list">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.id} className="product-item">
            {/* Add a placeholder image here */}
            <img 
              src={`https://via.placeholder.com/100x100?text=${product.name}`} 
              alt={product.name} 
              className="product-image"
            />
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>Region: {product.region}</p>
              <p>Price: ₹{product.price}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
};

export default ProductList;
