const financialReportModel = {
    id: String, // UUID
    title: String,
    reportType: {
      type: String,
      enum: ["monthly", "quarterly", "annual", "custom"],
    },
    startDate: Date,
    endDate: Date,
    departments: [String], // Array of department ids
    summary: {
      totalRevenue: Number,
      totalExpenses: Number,
      netProfit: Number,
      growthRate: Number,
    },
    revenueBreakdown: [
      {
        department: String,
        amount: Number,
        percentage: Number,
      },
    ],
    expenseBreakdown: [
      {
        category: String,
        amount: Number,
        percentage: Number,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "finalized", "approved"],
      default: "draft",
    },
    generatedBy: String, // User id who generated the report
    approvedBy: String, // User id who approved the report
    createdAt: Date,
    updatedAt: Date,
  };
  