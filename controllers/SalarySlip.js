const SalarySlip = require('../models/SalarySlip'); // Adjust path if needed
const Attendance = require('../models/Attendance'); // Adjust path if needed
const User = require('../models/User'); // Adjust path if needed
const moment = require('moment');
const LeaveRequest = require('../models/LeaveRequest');


// Controller to calculate and save the final salary slip for an employee
function getMonthsByJoiningDate(joiningDate) {
  // Parse the joining date (assuming it's in 'YYYY-MM-DD' format)
  const joining = new Date(joiningDate);
  const currentYear = new Date().getFullYear();  // Current year
  const joiningYear = joining.getFullYear();    // Year of joining
  const joiningMonth = joining.getMonth();      // Month of joining (0-based, so January = 0)

  let yearsWithMonths = [];

  // Loop through each year from joining year to current year
  for (let year = joiningYear; year <= currentYear; year++) {
      let months = [];
    
      // If the year is the joining year, we start from the joining month
      if (year === joiningYear) {
          for (let month = joiningMonth; month <= 11; month++) {
              months.push(new Date(year, month).toLocaleString('default', { month: 'long' }));
          }
      }
      // If the year is after the joining year, we start from January
      else {
          for (let month = 0; month <= 11; month++) {
              months.push(new Date(year, month).toLocaleString('default', { month: 'long' }));
          }
      }
    
      // Add the year and its months to the result
      yearsWithMonths.push({ year, months });
  }

  return yearsWithMonths;
}


// Helper function to format the month and year into 'YYYY-MM'
function formatMonthYear(year, month) {
  const monthString = month < 10 ? `0${month}` : `${month}`;
  return `${year}-${monthString}`;
}



// Controller to get the list of years and months based on the attendance of a newly created employee


// Controller to get the list of years and months based on employee joining date
exports.getAttendanceYearsAndMonths = async (req, res) => {
  const { employeeId } = req.params; // employeeId is passed as a parameter in the request URL

  try {
    // Step 1: Fetch user details to get the joining date
    const user = await User.findById(employeeId).select('joining_date'); // Only selecting joining_date field

    if (!user) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const joiningDate = user.joining_date;
    
    if (!joiningDate) {
      return res.status(400).json({ message: 'Joining date not available for this employee' });
    }

    // Step 2: Get the current year and month
    const currentYear = moment().year();
    const currentMonth = moment().month() + 1; // month is zero-indexed, so add 1

    // Step 3: Extract the joining year and joining month
    const joiningYear = moment(joiningDate).year();
    const joiningMonth = moment(joiningDate).month() + 1; // month is zero-indexed, so add 1

    // Step 4: Generate list of years from the joining year to the current year
    const yearsList = [];
    for (let year = joiningYear; year <= currentYear; year++) {
      yearsList.push(year);
    }

    // Step 5: Generate list of months for each year
    const monthsList = [];
    for (let year = joiningYear; year <= currentYear; year++) {
      const startMonth = (year === joiningYear) ? joiningMonth : 1; // Start from the joining month for the joining year
      const endMonth = (year === currentYear) ? currentMonth : 12; // End at current month for the current year

      for (let month = startMonth; month <= endMonth; month++) {
        monthsList.push(month);
      }
    }

    // Step 6: Return the response with the years and months lists
    res.status(200).json({
      years: yearsList,
      months: monthsList,
    });

  } catch (error) {
    console.error('Error fetching attendance years and months:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Controller to get net salary of every month from the joining month to the current month
exports.getMonthlyNetSalary = async (req, res) => {
  const { employeeId } = req.params;  // employeeId is passed as a parameter in the request URL

  try {
    const user = await User.findById(employeeId);
    if (!user) {
      return res.status(500).json({ message: 'Employee not found!' });
    }

    let monthlyNetSalaries = await SalarySlip.find({ employeeId });
    let monthlyAttendance = await Attendance.find({ employeeId: user._id, overTime: { $gte: 1 } });

    // Use a for...of loop to await each update sequentially
    for (let salarySlip of monthlyNetSalaries) {
      const month = salarySlip.month;

      // Filter attendance records for the current month
      const employeeAttendance = monthlyAttendance.filter(attend => attend.date.includes(month));

      // Calculate total overtime hours for the current month
      const totalOvertime = employeeAttendance.reduce((accum, current) => accum + current.overTime, 0);

      // Split year and month from the month string in the format "YYYY-MM"
      const [yr, mnt] = salarySlip.month.split("-");
      let lastDay = new Date(yr, mnt, 0); // Get the last day of the month
      lastDay = lastDay.getDate(); // Last day of the month

      // Step 1: Add allowances (DA, TA, HRA, other allowances) to the base salary
      const totalSalaryWithAllowances = salarySlip.salaryComponents.baseSalary 
                                      + salarySlip.salaryComponents.DA 
                                      + salarySlip.salaryComponents.TA 
                                      + salarySlip.salaryComponents.HRA 
                                      + salarySlip.salaryComponents.allowances;

      // Step 2: Calculate daily salary (total salary with allowances divided by number of days in month)
      const baseSalaryPerDay = totalSalaryWithAllowances / lastDay;

      // Step 3: Calculate daily wage for the employee based on the total number of present days
      const daysPresent = await Attendance.find({ employeeId: salarySlip.employeeId, status: "Present", date: { $regex: `^${yr}-${mnt}` } });
      console.log("dayss prresent ", daysPresent)
      const payForPresents = baseSalaryPerDay * daysPresent.length;

      // Step 4: Calculate the hourly wage (divide daily wage by 8 hours)
      const wagePerHour = baseSalaryPerDay / 8;  // assuming 8 hours per workday

      // Step 5: Calculate overtime amount based on total overtime hours
      const overTimeAmount = wagePerHour * totalOvertime;

      // Step 6: Calculate the total payable salary
      const payableSalary = payForPresents + overTimeAmount;

      // console.log("salaryslip's weekoffs ", salarySlip.weekoff)
      // console.log("salaryslip's holidays ", salarySlip.holiday)
      let paybleWeekOffs = [];

    // to check weekoff applicable for pay or not
    const weekoffAllowed = salarySlip.weekoff.dates.map(async (v) => {
      let [year, month, day] = v.split("-").map(Number);
      
      // Calculate the range for checking the date before and after the weekoff
      let lowerDate = day - 2; // Check 2 days before the weekoff
      let higherDate = day + 2; // Check 2 days after the weekoff
      
      let startDateBefore, endDateBefore, startDateAfter, endDateAfter;
      
      const lastDayOfMonth = new Date(year, month, 0).getDate(); // Get the last day of the current month
      
      // Handle cases where the date is the first day of the month or the last day of the month
      if (day === 1) {
          // If it's the first day of the month, adjust to the last day of the previous month
          const prevMonth = month === 1 ? 12 : month - 1;
          const prevYear = prevMonth === 12 ? year - 1 : year;
          const lastDayOfPrevMonth = new Date(prevYear, prevMonth, 0).getDate(); // Get last day of previous month
          
          lowerDate = lastDayOfPrevMonth - 1; // Adjust to the last day of the previous month
          startDateBefore = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(lowerDate).padStart(2, '0')}`;
          endDateBefore = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      } else if (day === lastDayOfMonth) {
          // If it's the last day of the month, adjust to the previous 2 days
          startDateBefore = `${year}-${String(month).padStart(2, '0')}-${String(day - 2).padStart(2, '0')}`;
          endDateBefore = `${year}-${String(month).padStart(2, '0')}-${String(day - 1).padStart(2, '0')}`;
          
          // Skip checking after the weekoff date since it is the last day of the month
          startDateAfter = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          endDateAfter = `${year}-${String(month).padStart(2, '0')}-${String(day + 1).padStart(2, '0')}`;
      } else {
          // If not first or last day of the month, normal case
          startDateBefore = `${year}-${String(month).padStart(2, '0')}-${String(lowerDate).padStart(2, '0')}`;
          endDateBefore = `${year}-${String(month).padStart(2, '0')}-${String(day - 1).padStart(2, '0')}`;
          
          startDateAfter = `${year}-${String(month).padStart(2, '0')}-${String(day + 1).padStart(2, '0')}`;
          endDateAfter = `${year}-${String(month).padStart(2, '0')}-${String(higherDate).padStart(2, '0')}`;
      }
  
      // Check if there are 1 or 2 days before the weekoff date with "Present", "Leave", "Weekoff", or "Holiday"
      let attendanceBeforeWeekoff = await Attendance.find({
          date: { $gte: startDateBefore, $lte: endDateBefore }, // Date before weekoff
          $or: [
              { status: "Present" },
              { status: "Leave" },
              { status: "Weekoff" },
              { status: "Holiday" }
          ]
      });
  
      // Check if there are 1 or 2 days after the weekoff date with "Present", "Leave", "Weekoff", or "Holiday"
      let attendanceAfterWeekoff = await Attendance.find({
          date: { $gte: startDateAfter, $lte: endDateAfter }, // Date after weekoff
          $or: [
              { status: "Present" },
              { status: "Leave" },
              { status: "Weekoff" },
              { status: "Holiday" }
          ]
      });
  
      // If both conditions are satisfied (1 or 2 days before and after), mark the weekoff as applicable
      if (attendanceBeforeWeekoff.length > 0 && attendanceAfterWeekoff.length > 0) {
          return {
              date: v,         // The original weekoff date
              status: "Weekoff",  // Mark as weekoff
              applicable: true   // Indicate that the weekoff is applicable
          };
      } else {
          return {
              date: v,         // The original weekoff date
              status: "Weekoff",  // Mark as weekoff
              applicable: false  // Indicate that the weekoff is not applicable
          };
      }
  });
  
  // Wait for all promises to resolve and get the results
  const weekoffAttendPromises = await Promise.all(weekoffAllowed);
  

  const holidayAllowed = salarySlip.holiday.dates.map(async (v) => {
    // Split the holiday date into year, month, and day
    let [year, month, day] = v.split("-").map(Number);
    
    // Calculate the range for checking the date before and after the holiday
    let lowerDate = day - 1; // Check 1 day before the holiday
    let higherDate = day + 1; // Check any number of present after the holiday
    
    let startDate, endDate;
    
    // Check if the holiday date is the first day of the month
    if (lowerDate < 1) {
        // If the holiday is the first day of the month, adjust to the last day of the previous month
        const prevMonth = month === 1 ? 12 : month - 1; // Handle January going back to December
        const prevYear = prevMonth === 12 ? year - 1 : year; // Adjust year if going back to December
        const lastDayOfPrevMonth = new Date(prevYear, prevMonth, 0).getDate(); // Get last day of previous month

        lowerDate = lastDayOfPrevMonth; // Set to the last day of the previous month
        startDate = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(lowerDate).padStart(2, '0')}`;
        endDate = `${year}-${String(month).padStart(2, '0')}-${String(higherDate).padStart(2, '0')}`;
    } else {
        // Normal case: the lowerDate is in the same month
        startDate = `${year}-${String(month).padStart(2, '0')}-${String(lowerDate).padStart(2, '0')}`;
        endDate = `${year}-${String(month).padStart(2, '0')}-${String(higherDate).padStart(2, '0')}`;
    }

    // Find attendance records before the holiday (1 day before) with any status (Present, Leave, Weekoff, or Holiday)
    let attendanceBeforeHoliday = await Attendance.find({
        date: {
            $gte: startDate, // Greater than or equal to the previous day
            $lte: endDate    // Less than or equal to the holiday date itself
        },
        $or: [
            { status: "Present" },
            { status: "Leave" },
            { status: "Weekoff" },
            { status: "Holiday" }
        ] // Check for Present, Leave, Weekoff, or Holiday
    });

    // Check if there are any "Present" records after the holiday date (higherDate onwards)
    let attendanceAfterHoliday = await Attendance.find({
        date: {
            $gte: `${year}-${String(month).padStart(2, '0')}-${String(higherDate).padStart(2, '0')}` // After the holiday date
        },
        status: "Present"   // Only consider "Present" status
    });

    // Check if there are at least 13 "Present" records in the month
    let presentDaysInMonth = await Attendance.find({
        date: {
            $gte: `${year}-${String(month).padStart(2, '0')}-01`,
            $lte: `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`
        },
        status: "Present"
    });

    // If all conditions are satisfied, return the holiday as applicable
    if (attendanceBeforeHoliday.length > 0 && attendanceAfterHoliday.length > 0 && presentDaysInMonth.length >= 13) {
        return {
            date: v,        // The original holiday date
            status: "Holiday",  // Mark as holiday
            applicable: true   // Indicate that the holiday is applicable
        };
    } else {
        return {
            date: v,        // The original holiday date
            status: "Holiday",  // Mark as holiday
            applicable: false   // Indicate that the holiday is not applicable
        };
    }
});

// Wait for all promises to resolve and get the results
const holidayAttendPromises = await Promise.all(holidayAllowed);

    console.log("holiday payble dates ", holidayAttendPromises.filter(v=> v.applicable === true))
    console.log("weekoff payble dates ", weekoffAttendPromises.filter(v=> v.applicable === true))
    

      
      // const attendancePresent = await Attendance.find( {  } ) 

      // Update the salary slip with the new overtime and payable salary
      await SalarySlip.updateOne(
        { _id: salarySlip._id, month: salarySlip.month },
        {
          $set: {
            "salaryComponents.overtime": totalOvertime,
            "payableSalary": payableSalary
          }
        }
      );
    }

    // Fetch updated salary slips with payable salary
    monthlyNetSalaries = await SalarySlip.find({ employeeId: user._id });

    // Format response with relevant salary information
    monthlyNetSalaries = monthlyNetSalaries.map(v => {
      return {
        employeeName: user.name,
        employeeId,
        month: v.month,
        payableSalary: v.payableSalary,
        salary: v.salaryAmount,
        joining_date: user.joining_date,
        department: user.department
      };
    });

    // Send the final response
    res.status(200).json({
      message: 'Monthly net salary fetched successfully',
      success: true,
      monthlyNetSalaries,
    });

  } catch (error) {
    console.error('Error fetching monthly net salary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// salary in details
exports.SalarySlipDetails = async (req, res) => {
  console.log(" salary slip in details ", req.params)
  try {
    const {employeeId, month} = req.params;

  console.log(" salary slip in details 2.1 ", employeeId)
  console.log(" salary slip in details 2.2 ", month)

    const salarySlip = await SalarySlip.findOne({ employeeId, month });

  console.log(" salary slip in details 3 ", salarySlip)


    if( !salarySlip ){
     return res.status(500).json({ message: ' No Salary slip found ! ' });
    }

    res.status(200).json({
      success : true,
      salarySlip
    })
  } catch (error) {
    console.log("error in catch part ", error)
   return res.status(500).json({ message: 'Server error' });
  }
}

// update or add weekoff
exports.setWeekoff = async (req, res) => {
  try {
    console.log("setWeekoff data ", req.body);

    let month = req.body.data[0].date.split("-");
    month = `${month[0]}-${month[1]}`

    console.log("month formt yyyy-mm ", month);


    const isSalarySlipExist = await SalarySlip.findOne( { employeeId : req.body.employeeId, month : month} );

    const dates = req.body.data.map((v)=> v.date)
    const days = req.body.data.map((v)=> v.day)


    if(!isSalarySlipExist){
      return res.status(500).json({ message: 'Employee Salary Slip not found!' });
    }

    isSalarySlipExist.weekoff = {
      days : days,
      daysLength : dates.length,
      dates : dates
    }

    await isSalarySlipExist.save();

    // let leaves = await LeaveRequest.find( { employeeId : req.body.employeeId, month : month } );

    for ( let dates of req.body.data) {
      await Attendance.create({
        employeeId : req.body.employeeId,
      date: dates.date,
      status: 'Weekoff',
      year: dates.date.split("-")[0],
      month: dates.date.split("-")[1],
      })
    }


    res.status(201).json({
      success : true,
      message : "Week Off updated successfully !"
    })

  } catch (error) {
    console.log("error in catch part ", error)
    return res.status(500).json({ message: 'Server error' });
  }
}