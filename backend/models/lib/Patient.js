const patientModel = {
    id: String, // UUID
    firstName: String,
    lastName: String,
    email: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
    },
    contactNumber: String,
    address: String,
    emergencyContact: {
      name: String,
      relationship: String,
      phoneNumber: String,
    },
    medicalHistory: [
      {
        condition: String,
        diagnosedDate: Date,
        notes: String,
      },
    ],
    createdAt: Date,
    updatedAt: Date,
  };