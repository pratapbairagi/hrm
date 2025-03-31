const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // Format: 'YYYY-MM-DD'
    status: { type: String, enum: ['Present', 'Absent', 'Leave', 'Weekoff', "Holiday"], default: 'Absent' },
    checkInTime: { type: Date }, // Store the time the employee checked in
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    overTime : { type : Number, default : 0 },
    requests : {
      overTime : {
        type : Number, default : 0
      },
      status : {
        type : String, default : "Absent"
      },
      approve : {
        type : String, default : "no"
      },
      requested : {
        type : String,
        defualt : "no"
      }
    }
  },
  { timestamps: true }
);

// Index for employeeId and date to make it efficient to query
attendanceSchema.index({ employeeId: 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
