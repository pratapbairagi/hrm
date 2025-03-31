const express = require('express');
const router = express.Router();
// const salarySlipController = require('../controllers/salarySlipController');
const authMiddleware = require('../middleware/auth');
const { getAttendanceYearsAndMonths, getMonthlyNetSalary, SalarySlipDetails, setWeekoff } = require('../controllers/SalarySlip');
const { verifyCookieToken } = require('../middleware/authMiddleware');

// Protected Routes (requires authentication)
router.use(authMiddleware.verifyToken); // Protect these routes with the JWT middleware


// router.route('/salary-slips/employee/:employeeId').get(verifyCookieToken, calculateSalary);

// get months and years list after employee joining
router.route('/salary-availble/:employeeId').get(verifyCookieToken, getAttendanceYearsAndMonths);


// get monthly salary with year and month detail
router.route('/salary-availble-every-month/:employeeId').get(verifyCookieToken, getMonthlyNetSalary);


// salary slip in details
router.route('/salary/:employeeId/:month').get(verifyCookieToken, SalarySlipDetails);

router.route('/salary/set-weekoff').post(verifyCookieToken, setWeekoff)

// Generate salary slip for a given month (Admin only)
// router.route('/salary-slips').post(verifyCookieToken, authMiddleware.checkAdmin, generateSalarySlip);

// // Get salary slips for an employee (Employee/Admin)
// router.route('/salary-slips/employee/:employeeId').get(verifyCookieToken, getEmployeeSalarySlips);

module.exports = router;
