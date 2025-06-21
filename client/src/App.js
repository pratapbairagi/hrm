import React, { useEffect, useState } from 'react';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SalaryDetails from './components/SalaryDetails';
import EmployeeAttendance from './components/EmployeeAttendance';
import Dashboard from './components/Dashboard';
import LeaveRequest from './components/LeaveRequest';
import EmployeesList from './components/EmployeesList';
import AddEmployeeForm from './components/AddEmployeeForm';
import EditEmployeeForm from './components/EditEmployeeForm';
import MarkAttendance from './components/MarkAttendance';
import PaySlipList from './components/PaySlipList';
import PaySlipDetail from './components/Payslip';
import PendingLeaves from './components/PendingLeaves';
import AllLeaves from './components/AllLeaves';
import AttendanceStatus from './components/EmployeesAttendedToday';
import Auth from './components/Auth';
import Home from './components/Home';
import { loggedUser } from './services/userService';
import ProtectedRoute from './components/ProtectedRoute';  // Import the ProtectedRoute component
import { Navigate } from 'react-router-dom';  // Import Navigate
import Profile from './components/Profile';
import AttendanceCalendar from './components/attendanceCalender';
import AllAttendanceUpdateRequests from './components/allAttendanceUpdateRequests';
import EditSalarySlip from './components/SalarySlipEdit';
import DateSelector from './components/DateSelector_weekoff';
import {holidays} from "./data/holidays"
import Holidays from './components/holidays';
import AppWrapper from './AppWrapper';

const App = () => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   async function checkLoggedUser() {
  //     const { success, user } = await loggedUser();
  //     if (success) {
  //       setAuth(true);
  //       setUser(user)
  //     } else {
  //       setAuth(false);
  //     }
  //   }

  //   checkLoggedUser();
  // }, []);

  // const navigate = useNavigate();

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const { success, user } = await loggedUser(); // checks if token/cookie is valid
  //     } catch (err) {
  //       if (err.message === 'Access denied. No token provided.') {
  //         navigate('/login');
  //       }
  //     }
  //   };

  //   checkAuth();
  // }, []);


  console.log("holidays ", holidays.length)

  return (
    <Router>
      <div className="container-fluid w-full flex h-screen">
        {/* {auth && <Navbar />} */}
        {/* {auth && <Dashboard />} */}
        <ToastContainer />
      <AppWrapper setAuth={setAuth} setUser={setUser}>
        <Routes>
          <Route exact path="/home" element={<Home />} />
          {/* If user is not logged in, redirect to auth page */}
          {/* If user is not logged in, redirect to auth page */}
          <Route path="/auth" element={!auth ? <Auth /> : <Navigate to={"/"} />} />
          {/* <Route path="/auth" element={!auth ? <Auth /> : <Navigate to="/dashboard" />} /> */}

          {/* Protected Routes */}
          <Route
            path="/"
            element={auth && user?.role === 'admin' ? <Dashboard user={user} /> : <Navigate to={auth ? "/" : "/auth"} />}
          />

           <Route 
            path="/attendance" 
            element={auth ? <AttendanceCalendar userId={user._id} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/employee/edit/:id" 
            element={auth ? <EditEmployeeForm /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/date-select/:employeeId" 
            element={auth ? <DateSelector user={user} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/holidays/list" 
            element={auth ? <Holidays user={user} /> : <Navigate to="/auth" />} 
          />
          
          {/* <Route 
            path="/add-employee" 
            element={auth ? <AddEmployeeForm /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/date-select/:employeeId" 
            element={auth ? <DateSelector user={user} /> : <Navigate to="/auth" />} 
          /> */}
          {/* <Route 
            path="/profile" 
            element={auth ? <Profile user={user} /> : <Navigate to="/auth" />} 
          /> */}
          {/* <Route 
            path="/attendance" 
            element={auth ? <MarkAttendance /> : <Navigate to="/auth" />} 
          /> */}
          {/* <Route 
            path="/attendance" 
            element={auth ? <AttendanceCalendar userId={user._id} /> : <Navigate to="/auth" />} 
          />
          
          <Route 
            path="/add-employee" 
            element={auth ? <AddEmployeeForm /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/employee/edit/:id" 
            element={auth ? <EditEmployeeForm /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/employees" 
            element={auth && user.role === "admin" ? <EmployeesList /> : <Navigate to={ auth ? "/profile" : "/auth" } />} 
          />
          <Route 
            path="/pay-slip/:employeeId" 
            element={auth ? <PaySlipList user={user} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/date-select/:employeeId" 
            element={auth ? <DateSelector user={user} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/holidays/list" 
            element={auth ? <Holidays user={user} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/pending-leaves" 
            element={auth ? <PendingLeaves /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/all-leaves" 
            element={auth ? <AllLeaves /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/employee-attended-today" 
            element={auth ? <AttendanceStatus /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/pay-slip-detail/:employeeId/:month" 
            element={auth ? <PaySlipDetail /> : <Navigate to="/auth" /> } 
          />
          <Route 
            path="/salary-slip/edit/:id" 
            element={auth ? <EditSalarySlip /> : <Navigate to="/auth" /> } 
          />
          <Route 
            path="/attendance/update/requests" 
            element={auth ? <AllAttendanceUpdateRequests /> : <Navigate to="/auth" /> } 
          />
          <Route 
            path="/leave" 
            element={auth ? <LeaveRequest user={user} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/salary" 
            element={auth ? <SalaryDetails /> : <Navigate to="/auth" />} 
          /> */}
        </Routes>
    </AppWrapper>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
