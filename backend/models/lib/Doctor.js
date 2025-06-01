// models/lib/Doctor.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  specialization: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true,
    enum: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Emergency', 'General']
  },
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
  experience: {
    type: Number, // Years of experience
    default: 0
  },
  consultationFee: {
    type: Number,
    default: 500
  },
  availability: {
    monday: { start: String, end: String, isAvailable: Boolean },
    tuesday: { start: String, end: String, isAvailable: Boolean },
    wednesday: { start: String, end: String, isAvailable: Boolean },
    thursday: { start: String, end: String, isAvailable: Boolean },
    friday: { start: String, end: String, isAvailable: Boolean },
    saturday: { start: String, end: String, isAvailable: Boolean },
    sunday: { start: String, end: String, isAvailable: Boolean }
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['active', 'on_leave', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
doctorSchema.index({ userId: 1 });
doctorSchema.index({ department: 1 });
doctorSchema.index({ status: 1 });

// Virtual populate for user details
doctorSchema.virtual('userDetails', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;