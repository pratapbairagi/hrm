
// // /src/components/Sidebar.js
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { logoutUser } from '../services/userService';

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   // Function to toggle the sidebar
//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   // logout
//   const logoutHandler = async () => {
//     const {success} = await logoutUser();

//     if(success){
//       toast.success('Logout successful');
//     }
//   }

//   return (
//     <div className="flex max-h-screen" >
//       {/* Sidebar Background Overlay on Small Screens */}
//       <div
//         className={`fixed inset-0 bg-gray-800 bg-opacity-50 lg:hidden transition-all duration-300 transform ${
//           isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}
//         onClick={toggleSidebar}
//       >
        
//       </div>

//       {/* Sidebar */}
//       <div
//         className={`lg:w-64 w-64 bg-gray-800 text-white h-screen z-50 transition-transform duration-300 transform ${
//           isOpen ? 'translate-x-0' : '-translate-x-full'
//         } lg:translate-x-0 lg:block`}
//         >
//         <div className="p-4 text-xl font-semibold">
//           <Link to="/" className="text-white">HR Management</Link>
//         </div>
//         <ul className="space-y-4 px-4">
//         <li>
//             <Link
//               to="/profile"
//               className="block px-4 py-2 hover:bg-gray-700 rounded-lg"
//             >
//               Profile
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/dashboard"
//               className="block px-4 py-2 hover:bg-gray-700 rounded-lg"
//             >
//               Dashboard
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/attendance"
//               className="block px-4 py-2 hover:bg-gray-700 rounded-lg"
//             >
//             Attendance
//             </Link>
//           </li>
//           {/* <li>
//             <Link
//               to="/mark-attendance"
//               className="block px-4 py-2 hover:bg-gray-700 rounded-lg"
//             >
//              Mark Attendance
//             </Link>
//           </li> */}
//           <li>
//             <Link
//               to="/leave"
//               className="block px-4 py-2 hover:bg-gray-700 rounded-lg"
//             >
//               Leave
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/employees"
//               className="block px-4 py-2 hover:bg-gray-700 rounded-lg"
//             >
//               Employees
//             </Link>
//           </li>

//           <li>
//             <Link
//               to="/holidays/list"
//               className="block px-4 py-2 hover:bg-gray-700 rounded-lg"
//             >
//               Holidays
//             </Link>
//           </li>

//           <li>
//             <button
//               style={{background:"transparent"}}
//               className="block px-4 py-2 hover:bg-gray-700 rounded-lg"
//               onClick={logoutHandler}
//             >
//               Logout
//             </button>
//           </li>
//         </ul>
//       </div>

//       {/* Mobile Toggle Button */}
//       <button
//         onClick={toggleSidebar}
//         className="lg:hidden w-[96%] absolute top-1 left-[2%] text-white bg-gray-800 p-3 rounded-md"
//       >
//         {isOpen ? 'Close' : 'Open'} Sidebar
//       </button>

//     </div>
//   );
// };

// export default Sidebar;

