const Attendance = require('../models/Attendance'); // Assume this is your Attendance model.
const User = require('../models/User'); // Assume this is your User model.
const moment = require('moment'); // For handling date formats easily.
const SalarySlip = require('../models/SalarySlip'); // Assuming the salary slip schema is in the SalarySlip model
const Holidays = require('../models/Holidays');

// Helper function to format date to 'YYYY-MM-DD'
const formatDate = (date) => {
  return moment(date).format('YYYY-MM-DD');
};

// Controller to fetch monthly attendance data for a user
exports.getMonthlyAttendance = async (req, res) => {

  console.log("attendance monthly called params ", req.params);
  const { userId, year, month } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch attendance records for the given month and year
    const attendanceRecords = await Attendance.find({
      employeeId: userId,
      year: parseInt(year),
      month: parseInt(month),
    });

    console.log("attendance ", attendanceRecords);


    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(404).json({ message: 'No attendance data found for this month' });
    }

    // Return the fetched attendance data
    res.status(200).json({
      message: 'Attendance data fetched successfully',
      attendance: attendanceRecords
    });
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Helper function to calculate the final salary
async function calculateSalary(employeeId, month, year) {
  const monthString = `${month.toString().padStart(2, '0')}`;

  try {
    // Fetch the salary slip for the given employee and month
    const salarySlip = await SalarySlip.findOne({ employeeId, month: monthString });

    if (!salarySlip) {
      return null; // No salary slip exists for this employee for the given month/year
    }

    // Extract salary components
    const {
      salaryComponents = {},
      extraIncome = [],
      extraDeductions = [],
      taxDeductions = []
    } = salarySlip;

    // Calculate the base salary
    let finalSalary = salaryComponents.baseSalary || 0;

    // Add allowances, bonuses, and other components if they exist
    finalSalary += salaryComponents.bonus || 0;
    // finalSalary += salaryComponents.overtime || 0;
    finalSalary += salaryComponents.allowances || 0;
    finalSalary += salaryComponents.TA || 0; // Transport Allowance
    finalSalary += salaryComponents.DA || 0; // Dearness Allowance
    finalSalary += salaryComponents.HRA || 0; // House Rent Allowance

    // Add extra income, if available
    extraIncome.forEach(income => {
      finalSalary += income.amount || 0; // Ensure each income has an amount field
    });

    // Deduct extra deductions, if available
    extraDeductions.forEach(deduction => {
      finalSalary -= deduction.amount || 0; // Ensure each deduction has an amount field
    });

    // Deduct tax deductions, if available
    taxDeductions.forEach(tax => {
      finalSalary -= tax.amount || 0; // Ensure each tax has an amount field
    });

    return finalSalary;
  } catch (error) {
    console.error('Error calculating salary:', error);
    throw new Error('Failed to calculate salary');
  }
};



// Controller to mark attendance for a specific day
exports.markAttendance = async (req, res) => {
  const { employeeId, status, checkInTime } = req.body;
  const currentDate = moment().format('YYYY-MM-DD');
  const currentMonth = moment().month() + 1; // 1-based month
  const currentYear = moment().year();

  try {
    // Find the user by ID
    const user = await User.findById(employeeId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the attendance for the current day is already marked
    let attendance = await Attendance.findOne({
      employeeId,
      date: currentDate,
    });

    if (attendance) {
      if (attendance.status !== "Present") {
        attendance = new Attendance({
          employeeId,
          date: currentDate,
          status: status,
          checkInTime: checkInTime,
          year: currentYear,
          month: currentMonth,
        });
        await attendance.save();
      }
    }
    else {
      attendance = new Attendance({
        employeeId,
        date: currentDate,
        status: status,
        checkInTime: checkInTime,
        year: currentYear,
        month: currentMonth,
      });
      await attendance.save();
    }

    // Find the last marked "Present" or "Leave" day
    const lastMarkedAttendance = await Attendance.findOne({
      employeeId,
      status: { $in: ['Present', 'Leave'] }, // Only consider Present and Leave
    })
      .sort({ date: 1 }) // Sort by date in descending order to get the last marked attendance
      .limit(1);

    // If there's a last marked day, find all missed days (but exclude current day)
    if (lastMarkedAttendance) {
      const lastMarkedDate = lastMarkedAttendance.date;

      // Get all dates from the last marked date until the day before the current date
      const missedDays = [];
      let dayToCheck = moment(lastMarkedDate).add(1, 'days'); // Start from the day after last marked date

      // Loop through all days between last marked date and current day minus one
      while (dayToCheck.isBefore(moment(currentDate), 'day')) {
        missedDays.push(dayToCheck.format('YYYY-MM-DD'));
        dayToCheck = dayToCheck.add(1, 'days');
      }

      // Mark all missed days as "Absent" if they are not already "Present" or "Leave"
      for (const missedDay of missedDays) {
        const missedAttendance = await Attendance.findOne({
          employeeId,
          date: missedDay,
        });

        if (!missedAttendance || (missedAttendance.status !== 'Present' && missedAttendance.status !== 'Leave' && missedAttendance.status !== 'Weekoff' && missedAttendance.status !== 'Holiday')) {
          // If attendance is not already marked as Present or Leave, mark it as Absent
          if (missedAttendance) {
            missedAttendance.status = 'Absent'; // Mark as "Absent"
            await missedAttendance.save();
          } else {
            // Create an attendance record for the missed day as "Absent"
            const absentAttendance = new Attendance({
              employeeId,
              date: missedDay,
              status: 'Absent',
              year: currentYear,
              month: currentMonth,
            });
            await absentAttendance.save();
          }
        }
      }
    }
    const isSalarySlipExist = await SalarySlip.findOne({ employeeId: employeeId, month: `${currentYear}-${currentMonth.toString().padStart(2, "0")}` });

    if (!isSalarySlipExist) {

      let lastSalarySlip = await SalarySlip.findOne({ employeeId: employeeId }).sort({ createdAt: -1 });

      const newSalarySlip = await SalarySlip.create({
        salaryComponents: {
          ...lastSalarySlip.salaryComponents,
          bonus: 0,
          overtime: 0
        },
        salaryAmount: lastSalarySlip.salaryAmount,
        month: `${currentYear}-${currentMonth}`,
        employeeId: employeeId
      })
    }
    else {

      const date = moment().format('YYYY-M');

      let isHolidaysExist = await Holidays.find({ "date.datetime.year": Number(date.split("-")[0]), "date.datetime.month": Number(date.split("-")[1]), active: true });

      isHolidaysExist = isHolidaysExist.map((v, i) => {
        let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const fulldate = `${v.date.datetime.year}-${(v.date.datetime.month).toString().padStart(2, "0")}-${(v.date.datetime.day).toString().padStart(2, "0")}`;
        const exactDate = new Date(fulldate)
        daysOfWeek = daysOfWeek[exactDate.getDay()];
        return {
          daysLength: i + 1,
          dates: fulldate,
          days: daysOfWeek
        }
      })

      let isSalarySlipExist = await SalarySlip.findOne({ month: `${isHolidaysExist[0].dates.split("-")[0]}-${isHolidaysExist[0].dates.split("-")[1]}`, employeeId: user._id });

      isSalarySlipExist.holiday = {
        daysLength: isHolidaysExist.length,
        dates: isHolidaysExist.map(v => v.dates),
        days: isHolidaysExist.map(v => v.days),
      };

      await isSalarySlipExist.save();

    }

    res.status(200).json({
      message: 'Attendance marked and salary updated successfully',
      attendance: attendance,
      // salarySlip: salarySlip,
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// calculate login duration
async function loginDurationFun ({checkInTime, checkOutTime}) {
  const loginTime = moment(checkInTime);
  const logoutTime = moment(checkOutTime);
  duration = moment.duration(logoutTime.diff(loginTime));

  return `${duration.hours()}:${duration.minutes()}`

}
// mark attendance from public scan qr code for attendance
exports.attendanceUpdateByPublicQrScan = async (req, res) => {
  let { userId, checkInTime, checkOutTime, logInDuration, date, type } = req.body;
  let currentYear = date.split("/")[2];
  let currentMonth = date.split("/")[0];
  let currentDay = date.split("/")[1];
  currentDay = currentDay.toString().padStart(2, "0")
  currentMonth = currentMonth.toString().padStart(2, "0")

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the attendance for the current day is already marked
    let attendance = await Attendance.findOne({
      employeeId: userId,
      date: `${currentYear}-${currentMonth}-${currentDay}`,
    });

    if (attendance) {
      if (attendance.status !== "Present") {

        attendance = new Attendance({
          employeeId: userId,
          date: `${currentYear}-${currentMonth}-${currentDay}`,
          status: "Present",
          checkInTime: checkInTime ? checkInTime : null,
          checkOutTime: checkOutTime ? checkOutTime : null,
          logInDuration: logInDuration,
          year: currentYear,
          month: currentMonth,
        });
        await attendance.save();
      }
      else {
        if(attendance.checkInTime){
        attendance.checkOutTime = checkOutTime;
        attendance.logInDuration = await loginDurationFun({checkInTime : attendance.checkInTime, checkOutTime})
        await attendance.save();
        }
        else{
          return res.status(401).json({
            message : "Sorry, you are not logged in !"
          })
        }
      }
    }
    else {
      attendance = new Attendance({
        employeeId: userId,
        date: `${currentYear}-${currentMonth}-${currentDay}`,
        status: "Present",
        checkInTime: checkInTime ? checkInTime : null,
        checkOutTime: checkOutTime ? checkOutTime : null,
        logInDuration: logInDuration,
        year: currentYear,
        month: currentMonth,
      });
      await attendance.save();
    }

    // console.log("saved attend ", await Attendance.findOne({ employeeId : userId, date : `${currentYear}-${currentMonth}-${currentDay}`}))

    // Find the last marked "Present" or "Leave" day
    const lastMarkedAttendance = await Attendance.findOne({
      employeeId: userId,
      status: { $in: ['Present', 'Leave'] }, // Only consider Present and Leave
    })
      .sort({ date: 1 }) // Sort by date in descending order to get the last marked attendance
      .limit(1);

    // If there's a last marked day, find all missed days (but exclude current day)
    if (lastMarkedAttendance) {
      const lastMarkedDate = lastMarkedAttendance.date;

      // Get all dates from the last marked date until the day before the current date
      const missedDays = [];
      let dayToCheck = moment(lastMarkedDate).add(1, 'days'); // Start from the day after last marked date

      // Loop through all days between last marked date and current day minus one
      while (dayToCheck.isBefore(moment(`${currentYear}-${currentMonth}-${currentDay}`), 'day')) {
        missedDays.push(dayToCheck.format('YYYY-MM-DD'));
        dayToCheck = dayToCheck.add(1, 'days');
      }

      // Mark all missed days as "Absent" if they are not already "Present" or "Leave"
      for (const missedDay of missedDays) {
        const missedAttendance = await Attendance.findOne({
          employeeId: userId,
          date: missedDay,
        });

        if (!missedAttendance || (missedAttendance.status !== 'Present' && missedAttendance.status !== 'Leave' && missedAttendance.status !== 'Weekoff' && missedAttendance.status !== 'Holiday')) {
          // If attendance is not already marked as Present or Leave, mark it as Absent
          if (missedAttendance) {
            missedAttendance.status = 'Absent'; // Mark as "Absent"
            await missedAttendance.save();
          } else {
            // Create an attendance record for the missed day as "Absent"
            const absentAttendance = new Attendance({
              employeeId: userId,
              date: missedDay,
              status: 'Absent',
              year: currentYear,
              month: currentMonth,
            });
            await absentAttendance.save();
          }
        }
      }
    }

    const isSalarySlipExist = await SalarySlip.findOne({ employeeId: userId, month: `${currentYear}-${currentMonth}` });

    if (!isSalarySlipExist) {

      let lastSalarySlip = await SalarySlip.findOne({ employeeId: userId }).sort({ createdAt: -1 });

      const newSalarySlip = await SalarySlip.create({
        salaryComponents: {
          ...lastSalarySlip.salaryComponents,
          bonus: 0,
          overtime: 0
        },
        salaryAmount: lastSalarySlip.salaryAmount,
        month: `${currentYear}-${currentMonth}`,
        employeeId: userId
      })
    }
    else {

      //  const date = `${currentYear}-${currentMonth}-${currentDay}`;
      let isHolidaysExist = await Holidays.find({ "date.datetime.year": Number(currentYear), "date.datetime.month": Number(date.split("/")[0]), active: true });

      isHolidaysExist = isHolidaysExist.map((v, i) => {
        let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const fulldate = `${v.date.datetime.year}-${(v.date.datetime.month).toString().padStart(2, "0")}-${(v.date.datetime.day).toString().padStart(2, "0")}`;
        const exactDate = new Date(fulldate)
        daysOfWeek = daysOfWeek[exactDate.getDay()];
        return {
          daysLength: i + 1,
          dates: fulldate,
          days: daysOfWeek
        }
      })

      let isSalarySlipExist = await SalarySlip.findOne({ month: `${isHolidaysExist[0].dates.split("-")[0]}-${isHolidaysExist[0].dates.split("-")[1]}`, employeeId: userId });

      isSalarySlipExist.holiday = {
        daysLength: isHolidaysExist.length,
        dates: isHolidaysExist.map(v => v.dates),
        days: isHolidaysExist.map(v => v.days),
      };

      await isSalarySlipExist.save();

    }

    let users = await User.find();
    let newUsers = [];
    const cd = moment().format('YYYY-MM-DD'); // Fixed month/day order

    for (let user of users) {
      let att = await Attendance.findOne({ date: cd, employeeId: user._id });

      if (att) {
        newUsers.push({
          ...user.toObject(),
          checkInTime: att.checkInTime || "--",
          checkOutTime: att.checkOutTime || "--",
          logInDuration: att.logInDuration || "-- : --"
        });
      } else {
        newUsers.push({
          ...user.toObject(),
          checkInTime: "--",
          checkOutTime: "--",
          logInDuration: "-- : --"
        });
      }
    }

    res.status(200).json({
      message: 'Attendance marked and salary updated successfully',
      attendance: attendance,
      users: newUsers
      // salarySlip: salarySlip,
    });

  } catch (error) {
    console.log("erooorrrr ", error);
    res.status(500).json({ message: 'Server error' });

  }
}


// today's all attendance (absent/present/leave)
exports.getTodayAttendance = async (req, res) => {
  try {
    // Get today's date in 'YYYY-MM-DD' format
    const today = moment().format('YYYY-MM-DD');

    // Query the Attendance collection for all records with today's date
    const attendanceRecords = await Attendance.find({ date: today });

    // If no records are found for today, return a message
    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(404).json({ message: 'No attendance data found for today' });
    }

    const present = attendanceRecords.filter(record => record.status === 'Present');
    const absent = attendanceRecords.filter(record => record.status === 'Absent');
    const leave = attendanceRecords.filter(record => record.status === 'Leave');
    const weekoff = attendanceRecords.filter(record => record.status === 'Weekoff');
    const holiday = attendanceRecords.filter(record => record.status === 'Holiday');

    // Return the attendance records with the status of each employee
    res.status(200).json({
      message: 'Today\'s attendance data fetched successfully',
      present,
      absent,
      leave,
      weekoff,
      holiday
    });

  } catch (error) {
    console.error('Error getting todays attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// attendance update request
exports.attendanceUpdateRequest = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { status, overTime, date } = req.body;

    const isUserExist = await User.findById(employeeId);

    if (!isUserExist) {
      return res.status(404).json({ message: 'Employee does not exist !' });
    }

    const isAttendanceExist = await Attendance.findOne({ employeeId: employeeId, date: date });

    if (status === "Leave" || status === "Present" || overTime > 0) {
      isAttendanceExist.requests = {
        status,
        overTime,
        approve: "no",
        requested: "yes"
      }
    }
    else {
      return res.status(404).json({ message: 'Request is not valid !' });
    }

    await isAttendanceExist.save();

    res.status(200).json({
      message: " Attendace update request sent successfully ! ",
      success: true
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

// adminn- attendnace requests list
exports.allAttendanceRequestsList = async (req, res) => {
  try {
    let attendanceRequestsList = await Attendance.find({ "requests.requested": "yes" });

    console.log("attendanceRequestsList ", attendanceRequestsList);

    // Step 2: Extract all employeeIds from attendance requests
    const employeeIds = attendanceRequestsList.map(request => request.employeeId);

    // Step 3: Fetch all users whose employeeId matches the ones from attendance requests
    const users = await User.find({ '_id': { $in: employeeIds } });

    // Step 4: Create a lookup map for employeeId to employeeName
    const userMap = users.reduce((map, user) => {
      map[user._id.toString()] = user.name;  // Use the string version of the ObjectId as key
      return map;
    }, {});

    // Step 5: Attach the employeeName to each attendance request
    attendanceRequestsList = attendanceRequestsList.map(request => {
      // Retrieve employee name from the userMap
      const employeeName = userMap[request.employeeId.toString()] || "Unknown";  // Default to "Unknown" if not found
      return { ...request.toObject(), employeeName };  // Return the request object with added employeeName
    });

    res.status(200).json({
      success: true,
      attendanceRequestsList
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

// attendance update
exports.updateAttendance = async (req, res) => {
  try {
    console.log("attendance update ", req.body);

    let isAttendanceExist = await Attendance.findById(req.body._id);

    if (req.body.requests.approve === "yes") {
      isAttendanceExist.overTime = Number(isAttendanceExist.overTime) + Number(req.body.requests.overTime);
      isAttendanceExist.status = req.body.requests.status;
      isAttendanceExist.requests = {
        status: "Absent",
        overTime: 0,
        approve: req.body.requests.approve,
        requested: "no",
      }
    }
    else {
      isAttendanceExist.requests = {
        status: "Absent",
        overTime: 0,
        approve: req.body.requests.approve,
        requested: "no",
      }
    }

    await isAttendanceExist.save();

    const attendanceRquestList = await Attendance.find({ "requests.requested": "yes" })

    res.status(200).json({
      success: true,
      message: "Attendance Updated successfully !",
      attendanceRquestList
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}