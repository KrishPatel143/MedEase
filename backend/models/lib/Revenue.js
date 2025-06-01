// models/lib/Revenue.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const revenueSchema = new Schema({
  appointmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'insurance', 'online'],
    required: true
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  status: {
    type: String,
    enum: ['success', 'pending', 'failed', 'refunded'],
    default: 'success'
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
revenueSchema.index({ date: -1 });
revenueSchema.index({ doctorId: 1 });
revenueSchema.index({ patientId: 1 });
revenueSchema.index({ status: 1 });

const Revenue = mongoose.model('Revenue', revenueSchema);

module.exports = Revenue;