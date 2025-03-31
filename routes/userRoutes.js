const express = require('express');
const router = express.Router();
// const userController = require('../controllers/User');
const authMiddleware = require('../middleware/auth'); // For verifying JWT token
const { loginUser, createUser, getAllUsers, getUserById, updateUser, userLogged, logoutUser, deleteUser, dashboardContent } = require('../controllers/User');
const { verifyCookieToken } = require('../middleware/authMiddleware');
const  adminAuthrized = require("../middleware/adminCheckingMiddleware")


// Public Routes
// router.post('/login', userController.login); // Login Route
// router.post('/users', userController.createUser); // Create new user (for Admin only)
router.route('/login').post(loginUser); // Login Route
router.route('/users').post(createUser); // Create new user (for Admin only)

// Protected Routes (requires authentication)
router.use(authMiddleware.verifyToken); // Protect these routes with the JWT middleware

router.route('/logged').get(verifyCookieToken, userLogged); // Get all users (Admin only)
router.route('/users').get(verifyCookieToken, adminAuthrized("admin"), getAllUsers); // Get all users (Admin only)
router.route('/user/:id').get(verifyCookieToken, getUserById); // Get user by ID
router.route('/users/:id').put( updateUser); // Update user (Admin only)
router.route('/logout').get(verifyCookieToken, logoutUser); // Update user (Admin only)
router.route('/user/delete/:id').delete(verifyCookieToken, adminAuthrized("admin"), deleteUser); // Update user (Admin only)
router.route('/dashboard').get(verifyCookieToken, adminAuthrized("admin"),  dashboardContent) // dashboard content

module.exports = router;
