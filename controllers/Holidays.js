const axios = require("axios");
const Holidays = require("../models/Holidays");

exports.createHolidays = async (req, res, next) => {
    try {
        const yr = new Date().getFullYear();
        const { countryCode, year } = req.body;

        // Check if holidays for the current year already exist in the DB
        const isCurrentYearHolidaysExist = await Holidays.findOne({ "date.datetime.year" : year });

        if (isCurrentYearHolidaysExist) {
            return res.status(400).json({
                success: false,
                message: "Current year's Holidays List already exists!"
            });
        } else {
            const api_key = "AxwRe0jlV4dzbGszFv7OBIFwO93BSxGr";
            const url = `https://calendarific.com/api/v2/holidays?api_key=${api_key}&country=${countryCode || "IN"}&year=${year || yr}`;

            const response = await axios.get(url);

            // Ensure holidays are available in the response
            let holidaysList = response?.data?.response?.holidays;

            // Map the API response to match the updated schema
            const holidaysToSave = holidaysList.map(holiday => ({
                name: holiday.name,
                description: holiday.description || "No description available",  // Default if missing
                country: {
                    id: holiday.country_code || countryCode,  // Use the country code from the API or the provided one
                    name: holiday.country || {},  // Fallback to "Unknown" if missing
                },
                date: {
                    iso: holiday.date.iso,
                    datetime: holiday.date.datetime || {}  // Ensure this is handled correctly
                },
                type: holiday.type || [],  // Use an empty array if type is missing
                primary_type: holiday.primary_type || "Unknown",  // Default to "Unknown"
                canonical_url: holiday.canonical_url || "",
                urlid: holiday.urlid || "",
                locations: holiday.locations || "All",
                states: holiday.states || "All",
                active : true
            }));

            // Use insertMany to save multiple holiday documents in one go
           let len = await Holidays.insertMany(holidaysToSave);

            return res.status(201).json({
                success: true,
                message: "Holidays generated successfully!"
            });
        }
    } catch (error) {
        console.error("Error while creating holidays: ", error);
        return res.status(500).json({ message: 'Server error' });
    }
};


// get all holidays list
exports.holidaysList = async (req, res, next) => {
    try {
        const holidaysList = await Holidays.find();

        if (holidaysList.length > 0) {
            res.status(200).json({
                success: true,
                holidays: holidaysList,
                message: ""
            })
        } else {
            res.status(200).json({
                success: false,
                holidays: [],
                message: "No Holidays generated yet to display !"
            })
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

// delete all holidays
exports.deleteAllHolidays = async (req, res, next) => {
    try {

        const yr = new Date().getFullYear();

        const isCurrentHolidaysExist = await Holidays.find({ "date.datetime.year" : yr });

        if (isCurrentHolidaysExist.length === 0 ) {
            return res.status(404).json({ message: 'Current holidays not available !' });
        }

        await Holidays.deleteMany({ "date.datetime.year" : yr });

        res.status(200).json({
            success: true,
            message: "Current year holidays list deleted successfully !"
        });

    } catch (error) {
        res.status(500).json({ message: error });
    }
}


// update holidays
exports.updateHolidays = async (req, res, next) => {
    try {

        const holidays = req.body;

        if ( !holidays || !Array.isArray(holidays)) {
            return res.status(400).json({ message: 'Missing required fields or holidays is not an array' });
        }

        const isCurrentHolidaysExist = await Holidays.find({ "date.datetime.year" : new Date().getFullYear(), "country.id" : "IN" });

        if (isCurrentHolidaysExist.length === 0) {
            return res.status(404).json({ message: 'Current holidays not available for update !' });
        }

        const updatePromises = holidays.map(holiday=>
            Holidays.findByIdAndUpdate(holiday._id, { active : holiday.active })
        )

        await Promise.all(updatePromises)

        res.status(200).json({
            success: true,
            message: "Holidays list updated successfully !"
        });

    } catch (error) {
        res.status(500).json({ message: error });
    }
}