const activityLogModel = {
    id: String, // UUID
    userId: String, // User who performed the action
    action: {
      type: String,
      enum: ["create", "update", "delete", "view", "login", "logout", "other"],
    },
    resourceType: {
      type: String,
      enum: ["user", "patient", "appointment", "invoice", "claim", "department", "inventory", "report", "system"],
    },
    resourceId: String, // ID of affected resource
    description: String, // Description of the activity
    details: Object, // Additional details about the activity
    ipAddress: String,
    userAgent: String,
    timestamp: Date,
  };