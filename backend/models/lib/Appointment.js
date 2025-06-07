// models/lib/Appointment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient is required']
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Doctor is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Emergency', 'General']
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date and time are required']
  },
  reason: {
    type: String,
    required: [true, 'Reason for visit is required'],
    enum: ['Consultation', 'Follow-up', 'Procedure', 'Emergency', 'Routine Check-up']
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled', 'rescheduled', "check-in","check-out", 'no-show'],
    default: 'upcoming'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  amount: {
    type: Number,
    default: 0
  },
  paymentDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'insurance', 'online'],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  completedAt: {
    type: Date
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
appointmentSchema.index({ appointmentDate: 1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ patient: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ department: 1 });
appointmentSchema.index({ paymentStatus: 1 });

// Method to check if an appointment can be cancelled
appointmentSchema.methods.canCancel = function() {
  // Only upcoming appointments can be cancelled
  if (this.status !== 'upcoming') {
    return false;
  }
  
  // Only allow cancellation up to 2 hours before appointment
  const now = new Date();
  const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  
  return this.appointmentDate > twoHoursFromNow;
};

// Method to get appointment duration in minutes (defaults to 30 minutes)
appointmentSchema.methods.getDuration = function() {
  return 30; // Fixed 30 minute appointments
};

// Virtual for formatted date (e.g., "Today, 10:00 AM")
appointmentSchema.virtual('formattedDate').get(function() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Set to midnight for date comparison
  now.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  
  const appointmentDate = new Date(this.appointmentDate);
  const comparableDate = new Date(appointmentDate);
  comparableDate.setHours(0, 0, 0, 0);
  
  let prefix = "";
  if (comparableDate.getTime() === now.getTime()) {
    prefix = "Today";
  } else if (comparableDate.getTime() === tomorrow.getTime()) {
    prefix = "Tomorrow";
  } else if (comparableDate.getTime() === yesterday.getTime()) {
    prefix = "Yesterday";
  } else {
    // Format the date as MM/DD/YYYY
    prefix = `${appointmentDate.getMonth() + 1}/${appointmentDate.getDate()}/${appointmentDate.getFullYear()}`;
  }
  
  // Format the time as HH:MM AM/PM
  const hours = appointmentDate.getHours();
  const minutes = appointmentDate.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${prefix}, ${formattedHours}:${formattedMinutes} ${ampm}`;
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;