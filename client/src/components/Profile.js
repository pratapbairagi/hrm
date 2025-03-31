import React from 'react';
import { NavLink } from 'react-router-dom';

const Profile = ({user}) => {

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Profile Image */}
          <div className="w-full md:w-1/3 bg-gray-200 flex justify-center items-center">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-gray-300">
              <img
                src="https://via.placeholder.com/150"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Profile Details */}
          <div className="w-full md:w-2/3 p-6">
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <h2 className="text-3xl font-semibold text-gray-800 capitalize">{user?.name}</h2>
                <p className="text-lg text-gray-500">{user?.role}</p>
                <p className="text-sm text-gray-400">{user?.joining_date}</p>
              </div>

              <div className="flex items-center space-x-4">
                <NavLink to={`/employee/edit/${user?._id}`} className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 focus:outline-none">
                  Edit Profile
                </NavLink>
                <NavLink to={`/pay-slip/${user?._id}`} className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 focus:outline-none">
                  Salary Slip
                </NavLink>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-800">Contact Information</h3>
                <ul className="list-none space-y-2">
                  <li className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 text-gray-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                    <span className="text-gray-600">{user?.email}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 text-gray-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6H2v12h2V6zm16 0h-2v12h2V6z"
                      />
                    </svg>
                    <span className="text-gray-600">{user?.contact}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800">Address</h3>
                <p className="text-gray-600">
                  {user?.address}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800">About</h3>
                <p className="text-gray-600">
                  A passionate web developer with over 5 years of experience in building dynamic and responsive websites using the latest technologies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
