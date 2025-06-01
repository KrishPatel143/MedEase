const invoiceModel = {
    id: String, // UUID or invoice number like "INV-001"
    patientId: String, // Reference to patient
    appointmentId: String, // Reference to appointment
    services: [
      {
        name: String,
        code: String, // Medical service code
        amount: Number,
        quantity: Number,
      },
    ],
    subtotal: Number,
    tax: Number,
    discount: Number,
    total: Number,
    status: {
      type: String,
      enum: ["draft", "pending", "paid", "overdue", "cancelled"],
      default: "draft",
    },
    dueDate: Date,
    paymentDate: Date,
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "cash", "insurance", "bank_transfer"],
    },
    notes: String,
    createdAt: Date,
    updatedAt: Date,
  };