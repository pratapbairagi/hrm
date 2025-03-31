const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const Attendance = require('./Attendance');

// Helper function to calculate daily wage
function calculateDailyWage(baseSalary, monthDays = 30) {
  return baseSalary / monthDays;
}

const salarySlipSchema = new Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: String },  // E.g., "2024-01"
    salaryAmount: { type: Number },
    deductions: { type: Number },
    payableSalary: { type: Number, default: 0 },  // New field for payable salary based on present days
    status: { 
      type: String, 
      enum: ['paid', 'pending'], 
      default: 'pending' 
    },
    weekoff : {
      daysLength : {
        type : Number
      },
      dates : {
        type : Array,
      },
      days : {
        type : Array
      }
    },
    holiday : {
      daysLength : {
        type : Number
      },
      dates : {
        type : Array,
      },
      days : {
        type : Array
      }
    },
    generatedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    salaryComponents: {
      baseSalary: { type: Number, required: true, default: 12000 },
      bonus: { type: Number, default: 0 },
      overtime: { type: Number, default: 0 },
      allowances: { type: Number, default: 0 },
      TA: { type: Number, default: 0, default: 1000 },  // Transport Allowance
      DA: { type: Number, default: 0, default: 0 },  // Dearness Allowance
      HRA: { type: Number, default: 0, default: 2000 }, // House Rent Allowance
    },
    leave_balance : {
      earned_leave : {
        type : Number,
        default : 0
      },
      annual_leave : {
        type : Number,
        default : 0
      }
    },
    extraIncome: [
      {
        description: { type: String },
        amount: { type: Number, default: 0 },
      }
    ],
    extraDeductions: [
      {
        description: { type: String },
        amount: { type: Number, default: 0 },
      }
    ],
    taxDeductions: [
      {
        taxType: { type: String },
        amount: { type: Number, default: 0 },
      },
    ],
    paymentMode: { type: String, enum: ['bank', 'cash', 'cheque'], default : "bank"},
    paymentDate: { type: Date },
    currency: { type: String, default: 'INR' },
  },
  { timestamps: true }
);

// Index for fast lookup by employeeId and month
salarySlipSchema.index({ employeeId: 1, month: 1 });

const SalarySlip = mongoose.model('SalarySlip', salarySlipSchema);

module.exports = SalarySlip;
