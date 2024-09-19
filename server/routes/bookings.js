var express = require('express');
const { route } = require(".")
var router = express.Router();
const { protect } = require("../middleware/authMiddleware")
// const { curDate } = require("../middleware/curDateTime")

const {
    checkAvailability, newBooking, getUpcomingBookings, cancelBooking,lookupVenues,participants
  } = require("../controllers/bookingController");
// const { isAdmin } = require('../middleware/isAdminMiddleware');

// router.get("/check/:date", checkAvailability)
router.get("/check/:date/:venue", protect, checkAvailability)
router.post("/", protect, newBooking)
router.get("/participants",protect,participants)
router.get("/venues", protect, lookupVenues)
router.get("/upcoming", protect, getUpcomingBookings)
router.put("/cancel", protect, cancelBooking)

module.exports = router;