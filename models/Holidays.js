const mongoose = require("mongoose");

// Define the sub-schema for each holiday
const holidaySchema = new mongoose.Schema({
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    country: {
      id: {
        type: String,
      },
      name: {
        type: Object,
      },
    },
    date: {
      iso: {
        type: String, // ISO date string (e.g., '2024-12-31')
      },
      datetime: {
        type: Object, // You can store additional date-related information here if needed
      },
    },
    type: {
      type: [String], // Array of holiday types (e.g., 'Observance')
    },
    primary_type: {
      type: String,
    },
    canonical_url: {
      type: String,
    },
    urlid: {
      type: String,
    },
    locations: {
      type: String, // Location details (e.g., 'All')
    },
    states: {
      type: String, // States for which the holiday is applicable (e.g., 'All')
    },
    active : {
      type : Boolean,
      default : true
    }
  }); // _id is set to false for sub-documents
  

// HolidaysSchema.index( { name : 1, date : 1 } );
const Holidays = mongoose.model('Holidays', holidaySchema);

module.exports = Holidays;