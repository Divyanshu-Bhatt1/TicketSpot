const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique:true
  },
  discountPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  couponCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  }
});

const Coupon = mongoose.model('Coupon', CouponSchema);

module.exports = Coupon;
