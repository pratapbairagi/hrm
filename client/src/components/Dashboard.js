import React, { useEffect, useState } from 'react';
import { getEmployees, getNotifications } from '../services/api'; // Import the getNotifications function
import { NavLink } from 'react-router-dom';
import { getDashabordContents } from '../services/userService';

const Dashboard = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);
  const [pendingLeaveCount, setPendingLeaveCount] = useState(0);
  const [upcomingReviews, setUpcomingReviews] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [allAttendanceRequestsList, setAllAttendanceRequestsList] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
      
       const data = await getDashabordContents();
       console.log("allAttendanceRequestsList ", data)

       setEmployeeCount(data.employeeCount);
       setAttendanceCount(data.attendanceCount);
       setLeaveCount(data.leaveRequestsCount);
       setPendingLeaveCount(data.pendingLeaveRequestsCount)
       setUpcomingReviews(0)
       setAllAttendanceRequestsList(data.attendanceRequestsListCount)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <h2>HR Management System Dashboard</h2>
      <div className="stats">
        <NavLink to="/employees" className="stat">
          <h4>Total Employees</h4>
          <p>{employeeCount}</p>
        </NavLink>

        <NavLink to="/employee-attended-today" className="stat">
          <h4>Employees Attended Today</h4>
          <p>{attendanceCount}</p>
        </NavLink>

        <NavLink to="/all-leaves" className="stat">
          <h4>Total Leave</h4>
          <p>{leaveCount}</p>
        </NavLink>

        <NavLink to="/pending-leaves" className="stat">
          <h4>Pending Leave Requests</h4>
          <p>{pendingLeaveCount}</p>
        </NavLink>

        <NavLink to="/attendance/update/requests" className="stat">
          <h4>Attendance Requests</h4>
          <p>{allAttendanceRequestsList}</p>
        </NavLink>

        <div className="stat">
          <h4>Upcoming Performance Reviews</h4>
          <p>{upcomingReviews}</p>
        </div>

        
      </div>

      {/* Display more detailed notifications */}
      <div className="notifications">
        {notifications.length > 0 && (
          <ul>
            {notifications.slice(0, 3).map((notification, index) => (
              <li key={index}>
                <p>{notification.message}</p>
              </li>
            ))}
            <NavLink to="/notifications" className="view-more">
              View All Notifications
            </NavLink>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
