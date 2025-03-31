const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaveRequestSchema = new Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employeeName : { type : String },
    leaveType: {
      type: String,
      required: true
    },
    leaveBalance: {
      earned_leave: { type: Number, default: 0 },
      casual_leave: { type: Number, default: 0 },
      sick_leave: { type: Number, default: 0 },
      maternity_leave: { type: Number, default: 0 },
      compensatory_off: { type: Number, default: 0 },
      marriage_leave: { type: Number, default: 0 },
      paternity_leave: { type: Number, default: 0 },
      bereavement_leave: { type: Number, default: 0 },
      leave_without_pay: { type: Number, default: 0 }
    },
    startDate: { 
      type: Date, 
      // required: true
    },
    endDate: { 
      type: Date, 
      // required: true,
      validate: {
        validator: function(v) {
          return this.startDate <= v;
        },
        message: props => `End date cannot be before start date!`
      }
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    reason: { 
      type: String 
    }
  },
  { timestamps: true }
);

// Index for employeeId and status for filtering
leaveRequestSchema.index({ employeeId: 1, status: 1 });

// Create the model
const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);

module.exports = LeaveRequest;
