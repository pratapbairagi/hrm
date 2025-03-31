const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const User = require('../models/User');
const User = require('../models/User');
const SalarySlip = require('../models/SalarySlip');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const moment = require('moment');
const Holidays = require('../models/Holidays');

// Create a new user (Admin can add employees)
// exports.createUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if the email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User with this email already exists.' });
//     }

//     // // Hash the password
//     // const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const newUser = new User({
//       name,
//       email,
//       password,
//       joining_date: new Date(),
//     });

//    const user = await newUser.save();

//     // After saving the user, create an initial leave request for the user
//     const newLeaveRequest = new LeaveRequest({
//       employeeId: user._id, // Associate the leave request with the user ID
//       employeeName: user.name,
//       employeePosition: user.position,
//       employeeDepartment: user.department,
//       leaveType: "leave_without_pay",  // Default leave type (can be adjusted)
//       leaveBalance: {
//         earned_leave: 0,
//         casual_leave: 0,
//         sick_leave: 0,
//         maternity_leave: 0,
//         compensatory_off: 0,
//         marriage_leave: 0,
//         paternity_leave: 0,
//         bereavement_leave: 0,
//         leave_without_pay: 0,
//       },
//       status: 'pending',  // Default status
//     });

//     // Save the initial leave request
//     await newLeaveRequest.save();

//     res.status(201).json({ message: 'User created successfully', user: newUser });
//   } catch (error) {
//     console.log("catch part error while creating new user : ", error)
//     res.status(500).json({ message: 'Error creating user', error });
//   }
// };
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      joining_date: new Date(), // Automatically set joining date to current date
    });

    let user = await newUser.save();

    // After saving the user, create an initial leave request for the user
    const newLeaveRequest = new LeaveRequest({
      employeeId: user._id, // Associate the leave request with the user ID
      employeeName: user.name,
      employeePosition: user.position,
      employeeDepartment: user.department,
      leaveType: "leave_without_pay",  // Default leave type (can be adjusted)
      leaveBalance: {
        earned_leave: 0,
        casual_leave: 0,
        sick_leave: 0,
        maternity_leave: 0,
        compensatory_off: 0,
        marriage_leave: 0,
        paternity_leave: 0,
        bereavement_leave: 0,
        leave_without_pay: 0,
      },
      status: 'pending',  // Default status
    });

    // Save the initial leave request
    await newLeaveRequest.save();

    // Step 2: Automatically create a default salary slip for the new user
    const currentMonth = moment().format('YYYY-MM');  // Get current month in "YYYY-MM" format

    // Check if salary slip already exists for the current month
    const existingSalarySlip = await SalarySlip.findOne({
      employeeId: user._id,
      month: currentMonth,
    });

    if (existingSalarySlip) {
      return res.status(400).json({ message: 'Salary slip already exists for this month.' });
    }

    // Create a new salary slip with default values
    const newSalarySlip = new SalarySlip({
      employeeId: user._id,
      month: currentMonth,
      generatedAt: moment(),
      salaryAmount: 12000,  // Initial amount (to be calculated later)
      deductions: 0,  // Default deductions (if any)
      payableSalary: 0,
      salaryComponents: {
        baseSalary: 12000,  // Default base salary
        bonus: 0,           // Default bonus
        overtime: 0,        // Default overtime
        allowances: 0,      // Default allowances
        TA: 0,           // Default transport allowance
        DA: 0,              // Default dearness allowance
        HRA: 0,          // Default house rent allowance
      },
      extraIncome: [],     // No extra income by default
      extraDeductions: [], // No extra deductions by default
      taxDeductions: [],   // No tax deductions by default
      paymentMode: 'bank', // Default payment mode
      paymentDate: null,   // No payment date initially
      currency: 'INR',     // Default currency
    });

    // Save the default salary slip to the database
    let salarySlip = await newSalarySlip.save();

    user.salary = salarySlip.salaryAmount;

    await user.save()

    // Respond with a success message
    res.status(201).json({ message: 'User and associated data (leave request, salary slip) created successfully', user: newUser });
  } catch (error) {
    console.log("Error while creating new user:", error);
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Login (authentication for employees/admins)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare password
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(400).json({ message: 'Invalid password' });
    // }
    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const cookieOption = {
      httpOnly: true,
      maxAge: (5 * 60 * 1000),
      secure: true
    }
    // Set token in HTTP-only cookie (secure flag should be used in production)
    res.cookie('auth_token', token, cookieOption);

    const year = new Date().getFullYear()

    let holidays = await Holidays.find({ "date.datetime.year": year, active: true });

    if (holidays.length > 0) {
      const markHolidaysFun = holidays.map(async (v) => {
        await Attendance.deleteMany({ year: v.date.datetime.year, status: "Holiday" });

        let isAttendancExist = await Attendance.findOne({
          employeeId: user._id,
          date: v.date.iso,
          status: "Holiday"
        });

        if (!isAttendancExist) {
          const newAttendance = new Attendance({
            employeeId: user._id,
            date: v.date.iso,
            status: "Holiday",
            checkInTime: new Date(),
            year: v.date.datetime.year,
            month: v.date.datetime.month,
          });

          holidays = await newAttendance.save()
        }
      }
      )

      await Promise.all(markHolidaysFun)
    }

    const date = new Date()

    const totalHolidaysAvailableForTheMonth = await Holidays.find({ "date.datetime.year": date.getFullYear(), "date.datetime.month": date.getMonth() + 1, active: true })
    
    console.log("holiday response 1 ", date.getMonth())
    console.log("holiday response 2 ", totalHolidaysAvailableForTheMonth)
    
    const allPromisses = totalHolidaysAvailableForTheMonth.map(async (v) => {
      let newHolidayAdded = new Attendance({
        employeeId: user._id,
        date: `${v.date.datetime.year}-${(v.date.datetime.month).toString().padStart(2, "0")}-${(v.date.datetime.day).toString().padStart(2, "0")}`,
        status: "Holiday",
        checkInTime: new Date(),
        year: v.date.datetime.year,
        month: (v.date.datetime.month).toString().padStart(2, "0"),
      });

      return await newHolidayAdded.save()
    });

    await Promise.all(allPromisses);

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.log("login error ", error)
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// userLogged
exports.userLogged = async (req, res, next) => {
  try {
    const userDetail = req.user;

    const user = await User.findById(userDetail._id)

    if (!user) {
      return res.status(400).json({ message: 'Something went wrong, login required !' });
    }

    res.status(200).json({
      success: true,
      message: "",
      user
    })

  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
}

// Get all employees (Admin only)
exports.getAllUsers = async (req, res) => {
  try {

    let users = await User.find();
    let newUsers = []
    for (let user of users) {
      let salarySlip = await SalarySlip.findOne({ employeeId: user._id }).sort({ "weekoff.dates": -1 });
      newUsers.push({ ...user.toObject(), weekoff: salarySlip.weekoff })
    }

    console.log("usersss ", newUsers)

    res.status(200).json({ users: newUsers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Get a specific user (by ID) - Employees can view their own profile, Admins can view any user
exports.getUserById = async (req, res) => {
  try {

    let user = await User.findById(req.params.id);


    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }



    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

// delete user by id (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(user._id);

    const users = await User.find();

    res.status(200).json({ users });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Edit an employee profile (Admin only)
exports.updateUser = async (req, res) => {
  try {
    console.log("id ", req.params)
    console.log("data ", req.body)
    const existingUser = req.user;

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found or need to login !' });
    }

    const {
      name,
      email,
      department,
      role,
      joining_date,
      contact,
      address,
      position,
      // about,
      salary, // Added salary field
      password } = req.body;

    existingUser.name = name;
    existingUser.email = email;
    existingUser.contact = contact;
    existingUser.role = role;
    existingUser.salary = salary;
    existingUser.department = department;
    existingUser.position = position;
    existingUser.address = address;
    existingUser.joining_date = joining_date;
    existingUser.password = password;

    const updatedUser = await existingUser.save();

    res.status(200).json({ message: 'User updated successfully', updatedUser });
  } catch (error) {
    console.log("catch error part ", error)
    res.status(500).json({ message: error || 'Error updating user', error });
  }
};

// logout

exports.logoutUser = async (req, res) => {
  try {
    const cookieOption = {
      httpOnly: true,
      maxAge: 0,
      secure: true
    }
    res.clearCookie("auth_token", cookieOption)
    req.user = undefined;

    res.status(200).json({
      success: true,
      message: "Logout successfully !"
    })
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
}

// dashboard
exports.dashboardContent = async (req, res) => {
  try {
    const employeeCount = await User.countDocuments();

    const today = new Date().toISOString().split('T')[0];
    const attendanceCount = await Attendance.countDocuments({ date: today });

    const leaveRequestsCount = await LeaveRequest.countDocuments();
    const pendingLeaveRequestsCount = await LeaveRequest.countDocuments({ status: "pending" });

    console.log("today")

    const attendanceRequestsListCount = await Attendance.countDocuments({ "requests.requested": "yes" });

    res.status(200).json({
      success: true,
      message: "",
      employeeCount,
      attendanceCount,
      leaveRequestsCount,
      pendingLeaveRequestsCount,
      attendanceRequestsListCount
    })

  } catch (error) {
    console.log("error in catch part ", error)
    res.status(500).json({ message: 'Something went wrong', error });
  }
}