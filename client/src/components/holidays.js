import { useEffect, useState } from "react"
import { deleteAllHolidays, generateHolidays, getHolidaysList, updateHolidays } from "../services/holidaysService"
import { toast } from "react-toastify";

const Holidays = ({ user }) => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [countryCode, setCountryCode] = useState("IN");
    const [loading, setLoading] = useState(false);
    const [holidays, setHolidays] = useState([])

    async function fetchData() {
        const response = await getHolidaysList({ year, countryCode });
        if (response.success) {
            setHolidays(response.holidays)
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    const generateHolidaysFunction = async () => {
        try {
            setLoading(true)
            const response = await generateHolidays({ year, countryCode });
            if (response.success) {
                setLoading(false)
                toast.success("New Holidays generated succesfully !");
                fetchData()
            }
        } catch (error) {
            setLoading(false)
            toast.error(error.message)
        }
    };

    const updateHolidaysFunction = async () => {
        try {
            setLoading(true);
            const response = await updateHolidays(holidays);
            if (response.success) {
                setLoading(false)
                toast.success(" Holidays updated succesfully !");
                fetchData()
            }
        } catch (error) {
            setLoading(false)
            toast.error(error.message)
        }
    }

    const deleteHolidaysFunction = async () => {
        try {
            setLoading(true);
            const response = await deleteAllHolidays();
            if(response.success) {
                setLoading(false)
                toast.success("Holidays deleted successfully !");
                fetchData()
            }
        } catch (error) {
            toast.error(error.message)
        }
    } 

    function getDayfun(dateString) {
        const date = new Date(dateString); // Convert the date string to a Date object
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return daysOfWeek[date.getDay()]; // Return the day of the week
    }

    function getMonthfun(dateString) {
        const date = new Date(dateString); // Convert the date string to a Date object
        const months = [
            "January", "February", "March", "April", "May", "June", "July", "August", 
            "September", "October", "November", "December"
        ]; 
        return months[date.getMonth()]; // Return the month name
    }

    // console.log("holidays list check for update ", holidays)

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-3 flex justify-between px-2 flex-wrap h-max w-full">
                <span> Holiday Calendar - {year} </span>
               { user.role === "admin" ? <div className="w-max px-3 flex gap-2">
                    <button onClick={() => generateHolidaysFunction()} className="btn text-xs px-3 py-1 text-gray-50 bg-blue-500 font-bold rounded-sm">
                        {loading ? "Loading..." : "Generate Holidays"}
                    </button>
                    <button onClick={() => updateHolidaysFunction()} className="btn text-xs px-3 py-1 text-gray-50 bg-orange-500 font-bold rounded-sm"> 
                    {loading ? "Loading..." :  "Edit Holidays"}
                    </button>
                    <button onClick={() => deleteHolidaysFunction()} className="btn text-xs px-3 py-1 text-gray-50 bg-red-500 font-bold rounded-sm">
                    {loading ? "Loading..." : "Delete All"}
                    </button>
                </div>
                :
                <></>
                }
            </h1>

            <div className="space-y-2 h-full max-h-[88vh] overflow-y-auto py-2 gap-x-1 flex flex-wrap">
                { holidays?.map((h, i) => {
                    if( ( user.role === "admin" ) ||  ( user.role === "employee" && h.active ) ){
                    return   <div key={i} className="bg-white shadow rounded-lg p-3 w-full lg:w-[48%]">
                            <h2 className="text-xs font-semibold mb-2 flex justify-between">
                               <span>{getMonthfun(h.date.iso)}</span>
                               {user.role === "admin" && (
                                   <div className="w-max flex flex-row justify-center items-center gap-x-2">
                                        <label className="text-[10px]" htmlFor={h.name}>Available : </label>
                                        <input type="checkbox" name={h.name} defaultValue={h.active} defaultChecked={h.active} onChange={(e)=> setHolidays( holidays.map(v=> v.name === h.name ? ({...v, active : e.target.checked}) : ({...v}) ) )} className="mb-1 cursor-pointer"/>
                                   </div>
                               )}
                            </h2>
                            <ul className="list-none space-y-1">
                                <li className="flex justify-between text-xs">
                                    <span>{h.date.datetime.day} - {h.name}</span>
                                    <span>{getDayfun(h.date.iso)}</span>
                                </li>
                            </ul>
                        </div>
                }
                })}
            </div>
        </div>
    );
}

export default Holidays;
