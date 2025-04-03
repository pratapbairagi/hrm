require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Import the connectDB function
const userRoutes = require('./routes/userRoutes'); // User-related routes
const attendanceRoutes = require('./routes/attendanceRoutes'); // Attendance-related routes
const leaveRoutes = require('./routes/leaveRoutes'); // Leave-related routes
const salarySlipRoutes = require('./routes/salarySlipRoutes'); // Salary slip-related routes
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const holidaysRouter = require('./routes/holidays');

const app = express();

// Middleware setup
app.use(cors({
  credentials : true,
    origin : [ "http://localhost:3001", "http://localhost:3000", "http://localhost:5000"],
    // origin : "*",
    methods : ["GET", "PUT", "POST", "DELETE", "PATCH"],
    allowedHeaders : ["Content-Type", "Authorization"]
}));

app.use(express.json({limit : "15mb"})) // To parse incoming JSON data
app.use(express.urlencoded({extended : true, limit : "50mb"}))
app.use(bodyParser.json({ limit : "25mb"}))
app.use(cookieParser());

// Routes
app.use('/api', userRoutes); // User-related routes (login, registration, profile)
app.use('/api', attendanceRoutes); // Attendance-related routes
app.use('/api', leaveRoutes); // Leave requests-related routes
app.use('/api', salarySlipRoutes); // Salary slip-related routes
app.use('/api', holidaysRouter); // Holidays - related routes

app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (req, res)=> {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    // res.send("hello world")
})

// Database connection
connectDB(); // Connect to MongoDB

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
