const express = require('express');
const router = express.Router();
// const leaveRequestController = require('../controllers/leaveRequestController');
const authMiddleware = require('../middleware/auth');
const { requestLeave, getAllLeaveRequests, getLeaveRequestsByEmployee, updateLeaveRequestStatus, getPendingLeaveRequests } = require('../controllers/LeaveRequest');
const { verifyCookieToken } = require('../middleware/authMiddleware');

// Protected Routes (requires authentication)
router.use(authMiddleware.verifyToken); // Protect these routes with the JWT middleware

// Request a leave
router.route('/leave-requests').post(verifyCookieToken, requestLeave);

// Get all leave requests (Admin only)
// router.route('/leave-requests').get(verifyCookieToken,authMiddleware.checkAdmin, getAllLeaveRequests);
router.route('/leave-requests').get(verifyCookieToken, getAllLeaveRequests);

// Get leave requests by employee (Admin or Employee)
router.route('/leave-requests/employee/:employeeId').get(verifyCookieToken, getLeaveRequestsByEmployee);

// Update leave request status (Admin only)
// router.route('/leave-requests/:leaveRequestId').put(verifyCookieToken, authMiddleware.checkAdmin, updateLeaveRequestStatus);
router.route('/leave-requests/:employeeId').put(verifyCookieToken, updateLeaveRequestStatus);

// get pending leave requests
router.route('/pending-leave-requests').get(verifyCookieToken, getPendingLeaveRequests);

module.exports = router;
