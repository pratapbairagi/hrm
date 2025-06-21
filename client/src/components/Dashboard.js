// import React, { useEffect, useState } from 'react';
// import { getEmployees, getNotifications } from '../services/api'; // Import the getNotifications function
// import { NavLink } from 'react-router-dom';
// import { getDashabordContents } from '../services/userService';

// const Dashboard = () => {
//   const [employeeCount, setEmployeeCount] = useState(0);
//   const [attendanceCount, setAttendanceCount] = useState(0);
//   const [leaveCount, setLeaveCount] = useState(0);
//   const [pendingLeaveCount, setPendingLeaveCount] = useState(0);
//   const [upcomingReviews, setUpcomingReviews] = useState(0);
//   const [notifications, setNotifications] = useState([]);
//   const [allAttendanceRequestsList, setAllAttendanceRequestsList] = useState(0);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
      
//        const data = await getDashabordContents();
//        console.log("allAttendanceRequestsList ", data)

//        setEmployeeCount(data.employeeCount);
//        setAttendanceCount(data.attendanceCount);
//        setLeaveCount(data.leaveRequestsCount);
//        setPendingLeaveCount(data.pendingLeaveRequestsCount)
//        setUpcomingReviews(0)
//        setAllAttendanceRequestsList(data.attendanceRequestsListCount)

//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="dashboard">
//       <h2>HR Management System Dashboard</h2>
//       <div className="stats">
//         <NavLink to="/employees" className="stat">
//           <h4>Total Employees</h4>
//           <p>{employeeCount}</p>
//         </NavLink>

//         <NavLink to="/employee-attended-today" className="stat">
//           <h4>Employees Attended Today</h4>
//           <p>{attendanceCount}</p>
//         </NavLink>

//         <NavLink to="/all-leaves" className="stat">
//           <h4>Total Leave</h4>
//           <p>{leaveCount}</p>
//         </NavLink>

//         <NavLink to="/pending-leaves" className="stat">
//           <h4>Pending Leave Requests</h4>
//           <p>{pendingLeaveCount}</p>
//         </NavLink>

//         <NavLink to="/attendance/update/requests" className="stat">
//           <h4>Attendance Requests</h4>
//           <p>{allAttendanceRequestsList}</p>
//         </NavLink>

//         <div className="stat">
//           <h4>Upcoming Performance Reviews</h4>
//           <p>{upcomingReviews}</p>
//         </div>

        
//       </div>

//       {/* Display more detailed notifications */}
//       <div className="notifications">
//         {notifications.length > 0 && (
//           <ul>
//             {notifications.slice(0, 3).map((notification, index) => (
//               <li key={index}>
//                 <p>{notification.message}</p>
//               </li>
//             ))}
//             <NavLink to="/notifications" className="view-more">
//               View All Notifications
//             </NavLink>
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import Person from '@mui/icons-material/Person';
import PersonAdd from '@mui/icons-material/PersonAdd';
import ManageAccounts from '@mui/icons-material/ManageAccounts';
import CalendarViewMonth from '@mui/icons-material/CalendarViewMonth';
import PeopleIcon from '@mui/icons-material/People';
import Profile from './Profile';
import EmployeesList from './EmployeesList';
import Holidays from './holidays';
import AddEmployeeForm from './AddEmployeeForm';
import EditEmployeeForm from './EditEmployeeForm';
import AllLeaves from './AllLeaves';
import PublicAttendance from './PublicAttendance';

// const NAVIGATION = [
//   {
//     kind: 'header',
//     title: 'Main items',
//   },
//   {
//     segment: 'profile',
//     title: 'Profile',
//     icon: <Person />,
//     element: <Profile />,
//   },
//   {
//     segment: 'dashboard',
//     title: 'Dashboard',
//     icon: <DashboardIcon />,
//     element: <h1>Dashboard</h1>,
//   },
//   {
//     segment: 'employee',
//     title: 'Employee',
//     icon: <PeopleIcon />,
//     element: <EmployeesList />,
//   },
//   {
//     kind: 'divider',
//   },
//   {
//     kind: 'header',
//     title: 'Analytics',
//   },
//   {
//     segment: 'attendance',
//     title: 'Attendance',
//     icon: <BarChartIcon />,
//     children: [
//       {
//         segment: 'leave',
//         title: 'Leave',
//         icon: <DescriptionIcon />,
//         element: <h1>Integrations</h1>
//       },
//       {
//         segment: 'holidays',
//         title: 'Holidays',
//         icon: <DescriptionIcon />,
//         element: <Holidays user={user}/>
//       },
//     ],
//   },
//   {
//     segment: 'integrations',
//     title: 'Integrations',
//     icon: <LayersIcon />,
//     element: <h1>Integrations</h1>,
//   },
// ];

const Dashboard = ({user}) => {
  const NAVIGATION = [
    {
      kind: 'header',
      title: 'Main items',
    },
    {
      segment: 'profile',
      title: 'Profile',
      icon: <Person />,
      element: <Profile user={user} />,
    },
    {
      segment: 'dashboard',
      title: 'Dashboard',
      icon: <DashboardIcon />,
      element: <h1>Dashboard</h1>,
    },
    {
      segment: 'employee',
      title: 'Employee',
      icon: <PeopleIcon />,
      element: <EmployeesList />,
    },
    // {
    //   segment: 'add employee',
    //   title: 'Add Employee',
    //   icon: <PersonAdd />,
    //   element: <AddEmployeeForm />,
    // },
    // {
    //   segment: 'edit employee',
    //   title: 'Edit Employee',
    //   icon: <ManageAccounts />,
    //   element: <EditEmployeeForm />,
    // },
    {
      segment: 'leave Requests',
      title: 'Leave',
      icon: <CalendarViewMonth />,
      element: <AllLeaves />,
    },
    {
      segment: 'holidays',
      title: 'Holidays',
      icon: <CalendarViewMonth />,
      element: <Holidays user={user} />,
    },
    {
      kind: 'divider',
    },
    {
      kind: 'header',
      title: 'Analytics',
    },
    {
      segment: 'attendance',
      title: 'Attendance',
      icon: <BarChartIcon />,
      element : <PublicAttendance/>
      // children: [
      //   {
      //     segment: 'leave',
      //     title: 'Leave',
      //     icon: <DescriptionIcon />,
      //     element: <h1>Integrations</h1>
      //   },
      //   {
      //     segment: 'holidays',
      //     title: 'Holidays',
      //     icon: <DescriptionIcon />,
      //     element: <Holidays user={user}/>
      //   },
      // ],
    },
    {
      segment: 'integrations',
      title: 'Integrations',
      icon: <LayersIcon />,
      element: <h1>Integrations</h1>,
    },
  ];
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar toggle


  const handleTabClick = (segment) => {
    setActiveTab(segment);
    setIsSidebarOpen(false); // Close sidebar when a tab is clicked on mobile
  };

  const getActiveTabContent = () => {
    const activeItem = NAVIGATION.find(
      (item) => item.segment === activeTab || (item.children && item.children.some(child => child.segment === activeTab))
    );

    if (activeItem) {
      if (activeItem.element) return activeItem.element;
      if (activeItem.children) {
        const childItem = activeItem.children.find(child => child.segment === activeTab);
        return childItem ? <h1>{childItem.title}</h1> : null;
      }
    }
    return <h1>No content available</h1>;
  };

  return (
    <div className="flex min-h-screen bg-gray-100 position-relative max-w-screen overflow-x-hidden">
      {/* Sidebar - Visible on Desktop and Mobile (Toggled on mobile) */}
      <aside style={{overflowY:"auto", maxHeight:"100vh", zIndex:"999"}} className={`fixed md:static flex flex-col bg-gray-800 text-white w-64 p-4 space-y-4 ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
        <div className="text-xl font-semibold text-white mb-6">
          <strong>LOGO</strong>
        </div>

        <div className="space-y-4">
          <div className="text-sm font-semibold text-gray-400">Main items</div>
          
          {NAVIGATION.filter(item => item.kind !== 'header' && item.kind !== 'divider').map(item => (
            <div key={item.segment} className="space-y-2 bg-gray-700 hover:bg-gray-800">
              <button
                onClick={() => handleTabClick(item.segment)}
                className="flex items-center p-2 rounded-md bg-transparent hover:bg-gray-800 text-gray-200 w-full"
              >
                {item.icon}
                <span className="ml-2 hover:bg-gray-800">{item.title}</span>
              </button>

              {item.children &&
                item.children.map(subItem => (
                  <button
                    key={subItem.segment}
                    onClick={() => handleTabClick(subItem.segment)}
                    className="flex items-center pl-8 p-2 rounded-md bg-gray-700 hover:bg-gray-800 text-gray-300"
                  >
                    {subItem.icon}
                    <span className="ml-2">{subItem.title}</span>
                  </button>
                ))
              }
            </div>
          ))}
        </div>
      </aside>

      {/* Mobile Hamburger Menu */}
      <div className={`md:hidden p-4 pt-2 fixed md:static w-screen top-0 left-0 ${isSidebarOpen? "flex justify-end" : "flex justify-start"}`} style={{zIndex:"998"}}>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`text-white w-[46px] h-[46px] flex justify-center items-center`}>
        {isSidebarOpen ? "✕" : "☰"}   
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{overflowY:"auto"}} className="flex-1 p-4 md:p-6 max-h-full">
        <div className="space-y-6">
          {/* <h2 className="text-3xl font-semibold">Dashboard</h2> */}
          <div className="bg-white max-w-screen">
            {getActiveTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


