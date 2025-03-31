const express = require('express');
const router = express.Router();
// const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/auth');
const { markAttendance, getTodayAttendance, getEmployeeAttendance, getMonthlyAttendance, attendanceUpdateRequest, allAttendanceRequestsList, updateAttendance } = require('../controllers/Attendance');
const { verifyCookieToken } = require('../middleware/authMiddleware');
const  adminAuthrized = require("../middleware/adminCheckingMiddleware")

// Protected Routes (requires authentication)
// router.use(authMiddleware.verifyToken); // Protect these routes with the JWT middleware

// Mark attendance for today (Employee)
// router.route('/attendance').post(verifyCookieToken, markAttendance);

// Get today's attendance for all employees (Admin only)
router.route('/attendance/today').get(verifyCookieToken, getTodayAttendance);

// Get attendance by employee (Employee/Admin)
// router.route('/attendance/employee/:employeeId').get(verifyCookieToken, getEmployeeAttendance);

router.route(`/attendance/getMonthlyAttendance/:userId/:year/:month`).get(verifyCookieToken, getMonthlyAttendance)


router.route("/attendance/markAttendance").post(verifyCookieToken, markAttendance)

// attendance update request
router.route('/attendance/request/:employeeId').post(verifyCookieToken, attendanceUpdateRequest)

// admin attendance requests
router.route('/attendance/requests').get(verifyCookieToken,  allAttendanceRequestsList)

// attendance update
router.route('/attendance/update').post(verifyCookieToken, updateAttendance)


module.exports = router;
