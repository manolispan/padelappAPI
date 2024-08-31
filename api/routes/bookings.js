const express =require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const multer= require('multer');
const sharp=require('sharp');
const fs = require('fs');
const db=require('../../database/db.js')
const jwt = require("jsonwebtoken");
const transport= require('../../nodemailer/nodemailertrans');
const auth = require("../../middleware/auth");
const logger =require("../../winston/logger");




router.post("/", auth, (req, res) => {
    const { date, idcourts } = req.query;

  
    // Validate query parameters
    if (!date || !idcourts) {
      return res.status(400).json({ error: 'Missing date or court ID' });
    }
  
    // SQL query to fetch bookings for the specified date and court ID
    const query = `
      SELECT *
      FROM bookings
      WHERE date = ? AND idcourts = ?  AND NOT (status = 'temporary' AND userId = ?)`;
  
    db.query(query, [date, idcourts,req.decoded.id], (err, results) => {
      if (err) {
        console.error('Error fetching bookings:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
  
      res.json(results); // Send the results as JSON
    });
  });

// Route to check and temporarily book slots
router.post('/check', auth, (req, res) => {
    const { date, courtId, timeSlots, userId,status } = req.body;

 
    let newStatus = ""
    if (status) {newStatus=status};
  
    // Check for existing bookings
    const existingBookingsQuery = `
      SELECT time 
      FROM bookings 
      WHERE idcourts = ? AND date = ? AND status != 'canceled' AND NOT (status = 'temporary' AND userId = ?)
    `;
  
    db.query(existingBookingsQuery, [courtId, date,req.decoded.id], (err, results) => {
      if (err) {
        console.error('Error querying existing bookings:', err);
        return res.status(500).json({
          success: false,
          message: 'An error occurred while checking existing bookings.',
        });
      }
  
      // Flatten booked time slots into an array
      const bookedTimeSlots = results.flatMap(booking => booking.time.split(','));
  
     

      // Check for conflicting slots
      const conflictingSlots = timeSlots.filter(slot => bookedTimeSlots.includes(slot));
  
      if (conflictingSlots.length > 0) {
        // Return conflicts
        return res.status(409).json({
          success: false,
          message: 'Some of the selected slots are no longer available.',
          conflictingSlots,
        });
      }
  
      // If no conflicts, insert a temporary booking

      const now = Date.now(); // Current time in milliseconds
      const expiresAt = now + 5 * 60 * 1000; // Expiration time (5 minutes from now)
      const shortBookingId = - (now % 1000000); 



      const newBooking = {
        idbookings: status == 'temporary' ? shortBookingId : null, // Use a negative value for temporary bookings
        idcourts: courtId,
        date: date, // Use the provided date directly
        time: timeSlots.join(','), // Join the array into a string for storage
        status: newStatus, // Mark as temporary
        userId: req.decoded.id, // Track the user making the booking
        created_at:now,
        expires_at: expiresAt, // Set expiration time (5 minutes from now)
      };
  
      db.query('INSERT INTO bookings SET ?', newBooking, (insertErr) => {
        if (insertErr) {
          console.error('Error inserting temporary booking:', insertErr);
          return res.status(500).json({
            success: false,
            message: 'An error occurred while reserving the time slots.',
          });
        }
  
        // Return success response
        res.json({
          success: true,
          message: 'Time slots reserved temporarily.',
        });
      });
    });
  });


// Route to check and temporarily book slots
router.post('/finalcheck', auth, (req, res) => {
  const { date, courtId, timeSlots, userId,status,
    team_a_player_a,team_a_player_b,team_b_player_a,team_b_player_b,
    team_a_player_a_name,team_a_player_b_name,team_b_player_a_name,team_b_player_b_name,
    team_a_player_a_surname,team_a_player_b_surname,team_b_player_a_surname,team_b_player_b_surname,
    team_a_player_a_added_by,team_a_player_b_added_by,team_b_player_a_added_by,team_b_player_b_added_by,
    rated,typeOfBooking
  } = req.body;


  let newStatus = ""
  if (status) {newStatus=status};

  // Check for existing bookings
  const existingBookingsQuery = `
    SELECT time 
    FROM bookings 
    WHERE idcourts = ? AND date = ? AND status != 'canceled' AND NOT (status = 'temporary' AND userId = ?)
  `;

  db.query(existingBookingsQuery, [courtId, date,req.decoded.id], (err, results) => {
    if (err) {
      console.error('Error querying existing bookings:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while checking existing bookings.',
      });
    }

    // Flatten booked time slots into an array
    const bookedTimeSlots = results.flatMap(booking => booking.time.split(','));

   

    // Check for conflicting slots
    const conflictingSlots = timeSlots.filter(slot => bookedTimeSlots.includes(slot));

    if (conflictingSlots.length > 0) {
      // Return conflicts
      return res.status(409).json({
        success: false,
        message: 'Some of the selected slots are no longer available.',
        conflictingSlots,
      });
    }

    // If no conflicts, insert a temporary booking

    const now = Date.now(); // Current time in milliseconds
    const expiresAt = now + 5 * 60 * 1000; // Expiration time (5 minutes from now)


    const newBooking = {
         idcourts: courtId,
      date: date, // Use the provided date directly
      time: timeSlots.join(','), // Join the array into a string for storage
      status: newStatus, // Mark as temporary
      userId: req.decoded.id, // Track the user making the booking
      created_at:now,
      expires_at: "", // Set expiration time (5 minutes from now)
      team_a_player_a : team_a_player_a,
      team_a_player_b : team_a_player_b,
      team_b_player_a : team_b_player_a,
      team_b_player_b : team_b_player_b,
      team_a_player_a_name : team_a_player_a_name,
      team_a_player_b_name : team_a_player_b_name,
      team_b_player_a_name : team_b_player_a_name,
      team_b_player_b_name : team_b_player_b_name,
      team_a_player_a_surname : team_a_player_a_surname,
      team_a_player_b_surname : team_a_player_b_surname,
      team_b_player_a_surname : team_b_player_a_surname,
      team_b_player_b_surname : team_b_player_b_surname,
      team_a_player_a_added_by : team_a_player_a_added_by,
      team_a_player_b_added_by : team_a_player_b_added_by,
      team_b_player_a_added_by : team_b_player_a_added_by,
      team_b_player_b_added_by : team_b_player_b_added_by,
      rated : rated,
      typeOfBooking : typeOfBooking

    };

    db.query('INSERT INTO bookings SET ?', newBooking, (insertErr) => {
      if (insertErr) {
        console.error('Error inserting temporary booking:', insertErr);
        return res.status(500).json({
          success: false,
          message: 'An error occurred while reserving the time slots.',
        });
      }

      // Return success response
      res.json({
        success: true,
        message: 'Time slots reserved temporarily.',
      });
    });
  });
});

  
  // Temporary booking expiration handler (e.g., a background job or cron job)
  const handleTemporaryBookingExpiration = () => {
    const cleanupQuery = `
      DELETE FROM bookings 
      WHERE status = 'temporary' AND expires_at < ?
    `;
  
    db.query(cleanupQuery, [Date.now()], (err) => {
      if (err) {
        console.error('Error cleaning up expired temporary bookings:', err);
      }
    });
  };


  // Run the expiration handler periodically (every minute)
setInterval(handleTemporaryBookingExpiration, 60 * 1000);


module.exports = router;