const Booking = require("../models/bookingModel");
const Venue = require("../models/venueModel");
const User = require("../models/userModel");
const Log = require("../models/logModel");
const asyncHandler = require("express-async-handler");
const axios = require("axios");

const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

function buildTimes(bookedSlots, localTime, date) {
  let slots = [];
  let hour = 7;
  for (let i = 7; i < 22; i++) {
    let booked = false;
    if (
      bookedSlots.indexOf(hour) != -1 ||
      (localTime.year == date.year &&
        localTime.month == date.month &&
        localTime.day == date.day &&
        hour <= localTime.hour + 0.5)
    ) {
      booked = true;
    }

    let price;
    if (hour < 18) {
      price = 50;
    } else {
      price = 100;
    }

    slots.push({
      time: `${hour}:00`,
      value: hour,
      price: price,
      booked: booked,
    });
    hour = hour + 0.5;

    booked = false;
    if (
      bookedSlots.indexOf(hour) != -1 ||
      (localTime.year == date.year &&
        localTime.month == date.month &&
        localTime.day == date.day &&
        hour <= localTime.hour + 0.5)
    ) {
      booked = true;
    }

    slots.push({ time: `${i}:30`, value: hour, price: price, booked: booked });
    hour = hour + 0.5;
  }
  return slots;
}

function dateSlicer(date) {
  return {
    year: Number(date.slice(0, 4)),
    month: Number(date.slice(5, 7)),
    day: Number(date.slice(8)),
  };
}

function futureDateChecker(reqDate, localTime) {
  if (
    (localTime.year == reqDate.year &&
      localTime.month == reqDate.month &&
      localTime.day > reqDate.day) ||
    (localTime.year == reqDate.year && localTime.month > reqDate.month) ||
    localTime.year > reqDate.year
  ) {
    return true;
  }
}

const lookupVenues = asyncHandler(async (req, res) => {
  const venues = await Venue.find()  
    .select({
      name: 1,
      address: 1,
      capacity: 1,
      type: 1
    })  // Specify the fields to retrieve
    .sort({ capacity: 1 });  // Sort by capacity in ascending order

  res.status(200).json({ venues });
});

const checkAvailability = asyncHandler(async (req, res) => {
  try {
    const now = new Date();
    const localTime = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      hour: now.getHours(),
      minute: now.getMinutes(),
    };

    const date = dateSlicer(req.params.date);
    const venue = req.params.venue;

    if (futureDateChecker(date, localTime)) {
      res.status(400).json({
        message: "You cannot book in the past. Please select a future date",
      });
      return;
    }

    // Get booking for date and venue
    const existingBookings = await Booking.find({
      year: date.year,
      month: date.month,
      day: date.day,
      venue: venue,
      status: { $not: { $eq: "cancelled" } },
    }).select({ slots: 1 });

    let bookedSlots = [];
    if (existingBookings) {
      for (let i = 0; i < existingBookings.length; i++) {
        bookedSlots.push(...existingBookings[i].slots);
      }
    }

    const times = buildTimes(bookedSlots, localTime, date);
    res.status(200).json({ times: times });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});



const participants = asyncHandler(async (req, res) => {
  try {
    // Fetch all users except those with the 'admin' role
    const participants = await User.find({ role: { $ne: 'admin' } });
    res.json({ participants });
  } catch (error) {
    res.status(500).json({ message: "Error fetching participants" });
  }
});


const newBooking = asyncHandler(async (req, res) => {
  if (req.body.slots.length < 1) {
    res.status(400).json({
      message: "Please select a slots and retry.",
    });
    return;
  }
  try {
    for (let i = 1; i < req.body.slots.length; i++) {
      if (req.body.slots[i].value - req.body.slots[i - 1].value != 0.5) {
        res.status(400).json({
          message:
            "A booking must have consecutive time slots. If you need to book non consecutive times, you may do so in a separate booking",
        });
        return;
      }
    }

    const now = new Date();
    const localTime = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      hour: now.getHours(),
      minute: now.getMinutes(),
    };

    const date = dateSlicer(req.body.date);
    const venue = req.body.venue;

    if (futureDateChecker(date, localTime)) {
      res.status(400).json({
        message: "You cannot book in the past. Please select a future date",
      });
      return;
    }

    const existingBookings = await Booking.find({
      year: date.year,
      month: date.month,
      day: date.day,
      venue: venue,
      status: { $not: { $eq: "cancelled" } },
    }).select({ slots: 1 });

    let bookedSlots = [];
    if (existingBookings) {
      for (let i = 0; i < existingBookings.length; i++) {
        bookedSlots.push(...existingBookings[i].slots);
      }
    }

    let total = 0;
    for (let i = 0; i < req.body.slots.length; i++) {
      if (bookedSlots.indexOf(req.body.slots[i].value) != -1) {
        res.status(400).json({
          message: `One of more of the time slots you are trying to book has already been booked. 
                Please retry with a different time.`,
        });
        total = 0;
        return;
      } else if (req.body.slots[i].value < 18) {
        total = total + 50;
      } else if (req.body.slots[i].value >= 18) {
        total = total + 100;
      }
    }

    const user = await User.findById(req.user._id);
    const newBalance = user.balance - total;

    if (total > user.balance) {
      res.status(400).json({
        message: "Insufficient balance, please top-up and try again.",
      });
      return;
    }

    let hour = 0;
    let minute = 0;
    if (Math.trunc(req.body.slots[0].value) < req.body.slots[0].value) {
      hour = Math.trunc(req.body.slots[0].value);
      minute = 30;
    } else {
      hour = req.body.slots[0].value;
      minute = 0;
    }

    const bookDate = new Date(
      Date.UTC(date.year, date.month - 1, date.day, hour, minute)
    );
    const unixDate = Math.floor(bookDate.getTime() / 1000);

    const userBalanceUpdate = await user.updateOne({
      balance: user.balance - total,
    });

    if (!userBalanceUpdate) {
      res.status(400).json({ message: "Database error. Please notify admin." });
      return;
    }

    const newBooking = await Booking.create({
      user: req.user._id,
      year: date.year,
      month: date.month,
      day: date.day,
      amount: total,
      slots: req.body.slots.map((slot) => slot.value),
      slots_full: req.body.slots,
      status: "confirmed",
      date: unixDate,
      venue: venue,
      participants: req.body.participants, 
    });



    const newLog = await Log.create({
      created_by: req.user._id,
      reference_user: req.user._id,
      user_address: req.user.address,
    
      type: "booking",
      text: `${req.user.address} booked ${req.body.slots.length / 2} hour/s at ${venue}, on ${
        date.day
      }/${date.month}/${date.year}, totalling ${total}. User's balance is now: ${user.balance - total}`,
    });

//     let info = {
//       from: process.env.EMAIL,
//       to: [req.user.email],
//       subject: `Venue booking confirmation`,
//       text: `
//         Hi ${req.user.name_first}, 
        
//         Your booking of time slots ${req.body.slots.map((slot) => slot.time)} (${req.body.slots.length / 2} hour/s) on ${
//         date.day
//       }/${date.month}/${date.year} at ${venue} is confirmed.
        
//         Confirmation #: ${newBooking._id.toString()}
//         Total amount charged: ${newBooking.amount}
//         Remaining account balance: ${user.balance - total}

//         This is an auto-generated email.
//         `,
//     };
//     const sendMail = async () => {
//       try {
//         await transporter.sendMail(info);
//         console.log("Mail sent successfully");
//       } catch (error) {
//         console.log(error);
//       }
//     };


//   sendMail(transporter, info);

//     res.status(200).json({ message: "Booking confirmed", remainingBalance: newBalance });

//   } catch (err) {
//     console.log(err);
//   }

// });


    // Sending confirmation email to the user
    let info = {
      from: process.env.EMAIL,
      to: [req.user.email],
      subject: `Venue booking confirmation`,
      text: `
        Hi ${req.user.name_first}, 
        
        Your booking of time slots ${req.body.slots.map((slot) => slot.time)} (${
        req.body.slots.length / 2
      } hour/s) on ${date.day}/${date.month}/${date.year} at ${venue} is confirmed.
        
        Confirmation #: ${newBooking._id.toString()}
        Total amount charged: ${newBooking.amount}
        Remaining account balance: ${newBalance}

        This is an auto-generated email.
      `,
    };
    
    const sendMail = async () => {
      try {
        await transporter.sendMail(info);
        console.log("Mail1 sent successfully");
      } catch (error) {
        console.log(error);
      }
    };


  sendMail(transporter, info);



    // Sending confirmation email to each participant
    const participantEmails = await User.find({ _id: { $in: req.body.participants } }).select('email name_first');
    
    participantEmails.forEach(async (participant) => {
      let participantInfo = {
        from: process.env.EMAIL,
        to: [participant.email],
        subject: `You have been added to a venue booking`,
        text: `
          Hi ${participant.name_first},

          You have been added as a participant for the booking on ${date.day}/${date.month}/${date.year} at ${venue}.

          Booking ID: ${newBooking._id.toString()}
          
          This is an auto-generated email.
        `,
      };
      await transporter.sendMail(participantInfo);
      console.log("Mail2 sent successfully");
    });

    res.status(200).json({
      message: "Booking confirmed",
      remainingBalance: newBalance,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "An error occurred while processing your booking.",
    });
  }
});










//*Get my booking
const getUpcomingBookings = asyncHandler(async (req, res) => {
  try {
    const currentDate = new Date();

    const localTime = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1, // getMonth() is zero-based
      day: currentDate.getDate(),
      hour: currentDate.getHours(),
      minute: currentDate.getMinutes()
  
    };

    // Convert the current date and time to UTC
    const requestTime = new Date(
      Date.UTC(
        localTime.year,
        localTime.month - 1,
        localTime.day,
        localTime.hour,
        localTime.minute
      )
    )

    const unixDate = Math.floor(requestTime.getTime() / 1000)

    const upcoming = await Booking.find({
      user: req.user._id,
      date: { $gte: `${unixDate}` },
      status: "confirmed",
    }).populate('venue', 'name')
    .populate('participants', 'name_first name_last')
    .sort({ date: 1 })

    res.status(200).json({ upcoming: upcoming })
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching upcoming bookings." });
  }


});

const cancelBooking = asyncHandler(async (req, res) => {
  //get booking
  try {
    const booking = await Booking.findById(req.body._id);

    //check if booking is valid
    if (!booking) {
      res.status(400).json({ message: "No such booking in the database" });
      return;
    }

    //check if user is owner of booking
    if (booking.user.toString() != req.user._id.toString()) {
      res
        .status(400)
        .json({ message: "You are not authorized to cancel this booking" });
      return;
    }

    //check that the booking is confirmed status
    if (booking.status != "confirmed") {
      res.status(400).json({
        message: `The booking is in ${booking.status} status, and cannot be cancelled.`,
      });
      return;
    }

    const now = new Date();

    const localTime = {
      year: now.getFullYear(),
      month: now.getMonth() + 1, // getMonth() is zero-based
      day: now.getDate(),
      hour: now.getHours(),
      minute: now.getMinutes(),
    };

    //check that booking is not in the past
    const requestTime = new Date(
      Date.UTC(
        localTime.year,
        localTime.month - 1,
        localTime.day,
        localTime.hour,
        localTime.minute
      )
    );

    const requestUnixDate = Math.floor(requestTime.getTime() / 1000);

    let hour = 0;
    let minute = 0;
    if (Math.trunc(booking.slots[0]) < booking[0]) {
      hour = Math.trunc(booking.slots[0]);
      minute = 30;
    } else {
      hour = booking.slots[0];
      minute = 0;
    }

    const bookingTime = new Date(
      Date.UTC(booking.year, booking.month - 1, booking.day, hour, minute)
    );

    const bookingUnixTime = Math.floor(bookingTime.getTime() / 1000);

    if (bookingUnixTime < requestUnixDate) {
      res.status(400).json({
        message: `Cannot cancel a past booking or a booking that already started`,
      });
      return;
    }

    //change booking status to cancelled
    const updatedBooking = await booking.updateOne({ status: "cancelled" });

    //update user balance
    const user = await User.findById(req.user._id);
    const updatedUser = await user.updateOne({
      balance: user.balance + booking.amount,
    });

    //log cancellation
    const newLog = await Log.create({
      created_by: req.user._id,
      reference_user: req.user._id,
      user_address: user.address,
      user_email: user.email,
      type: "refund",
      text: `${user.name_first} at ${user.address} cancelled ${
        booking.slots.length / 2
      } hour/s, on ${booking.day}/${booking.month}/${booking.year}, totalling ${
        booking.amount
      }. User's balance is now: ${user.balance + booking.amount}`,
    });


    let info = {
      from: process.env.EMAIL,
      to: [req.user.email],
      subject: `Venue booking cancellation`,
      text: `
        Hi ${user.name_first}, 
        
        Your booking of time slots ${booking.slots_full.map((slot) => {
          return slot.time;
        })} (${booking.slots.length / 2} hour/s) on ${booking.day}/${
        booking.month
      }/${booking.year} is cancelled.
        
        Confirmation #: ${newLog._id.toString()}
        Credited: ${booking.amount}
        Remaining account balance: ${user.balance + booking.amount}

        This is an auto-generated email.
        `,
    };
    const sendMail = async () => {
      try {
        await transporter.sendMail(info);
        console.log("Mail sent successfully");
      } catch (error) {
        console.log(error);
      }
    };

    sendMail(transporter, info);

    //return confirmation with amount of credit and new user balance.
    res.status(200).json({
      message: `Booking cancelled. You have been credited ${booking.amount}.`,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = {
  checkAvailability,
  newBooking,
  getUpcomingBookings,
  cancelBooking,
  lookupVenues,
  participants,

};
