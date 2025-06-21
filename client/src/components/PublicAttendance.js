import React, { useEffect, useState } from 'react';
import QrReader from 'react-qr-reader';
import { calculateHours } from '../helper/functions/calculationHrs';
import { attendanceUpdateFromPublicQrScan } from '../services/attendanceService';
import { getAllUsers } from '../services/userService';
import moment from 'moment';

const PublicAttendance = () => {
    const [users, setUsers] = useState([
        {
            name: '',
            _id: "",
            department: '',
            checkInTime: "",
            checkOutTime: "",
            date: "",
            logInDuration: "-- : --"
        }
    ]);

    useEffect(() => {
       async function getEmployeesFun (){
        const data = await getAllUsers({attendance : moment().format('YYYY-MM-DD')})
        setUsers(data?.users)
        }
        getEmployeesFun()
      }, []);

   
    const webcamError = (error) => {
        if (error) {
            console.log(error);
        }
    };

    
     const updateLogFun = async ({userId, checkInTime, checkOutTime, logInDuration, date, type}) => {
             const updatedLog = await attendanceUpdateFromPublicQrScan({ userId, date, checkInTime, checkOutTime, logInDuration, type });
             setUsers(updatedLog.users)

    }
    const webcamScan = (result) => {
        if (result) {

            let res = result.replace(/^"|"$/g, '');
            res = res.split("_")

            updateLogFun({ 
                userId : res[1], 
                date : new Date().toLocaleDateString(), 
                checkInTime : res[3] === "login" &&  new Date(), 
                checkOutTime : res[3] === "logout" &&  new Date(), 
                logInDuration : "-- : --",
                type : res[3]
            })

        }
    };


    return (
        <div className="antialiased font-sans bg-gray-200 max-h-screen overflow-auto relative">
            <div className="container mx-auto px-4 sm:px-8">
                <div className="py-8">
                    <h2 className="text-2xl font-semibold leading-tight">Users</h2>

                    {/* Filters */}
                    <div className="my-2 flex sm:flex-row flex-col">
                        <div className="flex flex-row mb-1 sm:mb-0 ">
                            <select className="appearance-none h-[42px] rounded-l border bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none">
                                <option>5</option>
                                <option>10</option>
                                <option>20</option>
                            </select>
                            <select className="appearance-none h-[42px] rounded-r border bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none">
                                <option>All</option>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>

                        <div className="block relative ml-0 sm:ml-2 mt-2 sm:mt-0 flex h-[42px]">
                            <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-gray-500">
                                    <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z" />
                                </svg>
                            </span>
                            <input
                                placeholder="Search"
                                className="appearance-none border rounded pl-8 pr-6 py-2 w-full bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                            />
                        </div>

                        <div className="block relative ml-0 sm:ml-2 mt-2 sm:mt-0">
                            <QrReader
                                delay={500}
                                onError={webcamError}
                                onScan={webcamScan}
                                legacyMode={false}
                                facingMode={"environment"}
                                className='w-[100px]'
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="w-full overflow-x-auto">
                        <div className="min-w-full max-w-screen-xl mx-auto bg-white rounded-lg shadow">
                            <table className="min-w-full table-auto">
                                <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3">User</th>
                                        <th className="px-4 py-3">Role</th>
                                        <th className="px-4 py-3">Login</th>
                                        <th className="px-4 py-3">Logout</th>
                                        <th className="px-4 py-3">Login Hrs</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-700">
                                    {users.map((user, idx) => (
                                        <tr key={idx} className="border-t">
                                            <td className="px-4 py-3 whitespace-nowrap flex items-center space-x-2">
                                                <img className="w-8 h-8 rounded-full" src={user.avatar} alt={user.name} />
                                                <span className="truncate">{user.name}</span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">{user.department}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div>{user.checkInTime ? user.date : "--"}</div>
                                                <div>{user.checkInTime ? moment(user.checkInTime).format('hh:mm:ss A') : "--"}</div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div>{user.checkOutTime ? user.date : "--"}</div>
                                                <div>{user.checkOutTime ? moment(user.checkOutTime).format('hh:mm:ss A') : "--"}</div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">{user.logInDuration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default PublicAttendance;
