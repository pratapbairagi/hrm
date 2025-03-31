
const express = require("express");
const { verifyCookieToken } = require("../middleware/authMiddleware");
const holidaysRouter = express.Router();
const  adminAuthrized = require("../middleware/adminCheckingMiddleware");
const { createHolidays, holidaysList, deleteAllHolidays, updateHolidays } = require("../controllers/Holidays");




// create holidays - fetch all new holidays from api call and save
holidaysRouter.route("/holidays/generate").post(verifyCookieToken, adminAuthrized("admin"), createHolidays);

// update holidays - active or deactive
holidaysRouter.route("/holidays/update").put(verifyCookieToken, adminAuthrized("admin"), updateHolidays);

// update holidays - delete all holidays
holidaysRouter.route("/holidays/delete").delete(verifyCookieToken, adminAuthrized("admin"), deleteAllHolidays);

// get holidays - all holidays
holidaysRouter.route("/holidays/list").get(verifyCookieToken, holidaysList);

module.exports = holidaysRouter