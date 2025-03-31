const LeaveRequest = require('../models/LeaveRequest');
const Attendance = require('../models/Attendance'); // Assuming you have an Attendance model
const moment = require('moment');

// Request a leave and update attendance
exports.requestLeave = async (req, res) => {
  try {
    console.log("Leave request working", req.body);
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;

    // Create a new leave request
    const leaveRequest = new LeaveRequest({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
      employeeName: req.user.name
    });

    await leaveRequest.save();

    // Update attendance for the requested leave dates
    const start = moment(startDate);
    const end = moment(endDate);
    let currentDate = start;

    // Loop through the date range and update attendance status to 'Leave'
    while (currentDate <= end) {
      const year = currentDate.year();  // Get the year from currentDate
      const month = currentDate.month() + 1;  // Get the month (1-indexed)

      // Find or create the attendance record and set status to 'Leave'
      await Attendance.findOneAndUpdate(
        { employeeId, date: currentDate.toDate() },
        { 
          $set: { 
            status: 'Leave',
            year: year,  // Explicitly set the year
            month: month  // Explicitly set the month
          } 
        },
        { new: true, upsert: true } // If attendance doesn't exist, create a new one
      );
      
      // Move to the next day
      currentDate = currentDate.add(1, 'days');
    }

    res.status(201).json({ message: 'Leave request submitted successfully', leaveRequest });
  } catch (error) {
    console.log("Error in catch part of leave request", error);
    res.status(500).json({ message: 'Error requesting leave', error });
  }
};


// Update leave request status and update attendance if approved
exports.updateLeaveRequestStatus = async (req, res) => {
  try {
    const { leaveRequestId, status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const leaveRequest = await LeaveRequest.findById(leaveRequestId);

    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Update leave request status
    leaveRequest.status = status;
    await leaveRequest.save();

    // If the leave request is approved, update the attendance
    if (status === 'approved') {
      const start = moment(leaveRequest.startDate);
      const end = moment(leaveRequest.endDate);
      let currentDate = start;

      while (currentDate <= end) {
        await Attendance.findOneAndUpdate(
          { employeeId: leaveRequest.employeeId, date: currentDate.toDate() },
          { $set: { status: 'Leave' } },
          { new: true }
        );
        currentDate = currentDate.add(1, 'days');
      }
    }

    const allLeaves = await LeaveRequest.find()

    res.status(200).json({ message: 'Leave request status updated', leaveRequest, allLeaves });
  } catch (error) {
    res.status(500).json({ message: 'Error updating leave request status', error });
  }
};

// Get leave request by employee (Admin or employee can access)
exports.getLeaveRequestsByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    console.log("leave request params id", employeeId)

    const leaveRequests = await LeaveRequest.find({ employeeId : employeeId });
    console.log("leave request working", leaveRequests)
    
    res.status(200).json({ leaveRequests });
  } catch (error) {
    console.log("leave request error in catc part : ", error)

    res.status(500).json({ message: 'Error fetching leave requests', error });
  }
};

// Get all leave requests (Admin only)
exports.getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find();
    console.log("total leaves ", leaveRequests)
    res.status(200).json({ leaveRequests });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leave requests', error });
  }
};


// get pending leave requests
exports.getPendingLeaveRequests = async (req, res) => {
  try{
    const pendingLeaveRequests = await LeaveRequest.find({ status : "pending" });

    res.status(200).json({
      success : true,
      pendingLeaveRequests
    })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leave requests', error });
  }
}