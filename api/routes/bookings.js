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
    team_a_player_a_ranking,team_a_player_b_ranking,team_b_player_a_ranking,team_b_player_b_ranking,
    rated,typeOfBooking,level,indoor,court_name
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
      team_a_player_a_ranking : team_a_player_a_ranking,
      team_a_player_b_ranking : team_a_player_b_ranking,
      team_b_player_a_ranking : team_b_player_a_ranking,
      team_b_player_b_ranking : team_b_player_b_ranking,
      rated : rated,
      level : level,
      indoor : indoor,
      court_name : court_name,
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


// Get All or Future Bookings with Optional Pagination
router.get("/", (req, res) => {
  const { future, status, userId, courtId, page, limit,sort, typeOfBooking, rated,date,filled  } = req.query;

  // Base query
  let query = `SELECT * FROM bookings`;
  const queryParams = [];

  // If 'future' query parameter is set to 'true', filter for future bookings
  if (future === 'true') {
    const tempDate = new Date();
    tempDate.setMinutes(tempDate.getMinutes() - tempDate.getTimezoneOffset());
    const formattedDate = tempDate.toISOString().split('T')[0];
    query += ` WHERE date >= ?`;
    queryParams.push(formattedDate);
  }

  // Add optional filters
  if (status) {
    query += future === 'true' ? ` AND` : ` WHERE`;
    query += ` status = ?`;
    queryParams.push(status);
  }

  if (userId) {
    query += future === 'true' || status ? ` AND` : ` WHERE`;
    query += ` userId = ?`;
    queryParams.push(userId);
  }

  if (courtId) {
    query += future === 'true' || status || userId ? ` AND` : ` WHERE`;
    query += ` idcourts = ?`;
    queryParams.push(courtId);
  }

 // Optional typeOfBooking filter
 if (typeOfBooking && typeOfBooking.trim() !== "") {
  query += future === 'true' || status || userId || courtId ? ` AND` : ` WHERE`;
  query += ` typeOfBooking = ?`;
  queryParams.push(typeOfBooking);
}

// Optional rated filter
if (rated && typeof date !== 'undefined' && rated.trim() !== "") {
  query += future === 'true' || status || userId || courtId || (typeOfBooking) ? ` AND` : ` WHERE`;
  query += ` rated = ?`;
  queryParams.push(rated);
}

  // Optional date filter
  if (date && typeof date !== 'undefined' && date.trim() != "") {
    query += future === 'true' || status || userId || courtId || typeOfBooking || rated ? ` AND` : ` WHERE`;
    query += ` date = ?`;
    queryParams.push(date);
  }

 // Optional filled filter
 if (filled === 'true') {
  query += future === 'true' || status || userId || courtId || typeOfBooking || rated || date ? ` AND` : ` WHERE`;
  query += ` team_a_player_a IS NOT NULL AND team_a_player_b IS NOT NULL AND team_b_player_a IS NOT NULL AND team_b_player_b IS NOT NULL`;
} else if (filled === 'false') {
  query += future === 'true' || status || userId || courtId || typeOfBooking || rated || date ? ` AND` : ` WHERE`;
  query += ` (team_a_player_a IS NULL OR team_a_player_b IS NULL OR team_b_player_a IS NULL OR team_b_player_b IS NULL)`;
}

  // Exclude bookings with status 'temporary'
  query += future === 'true' || status || userId || courtId || typeOfBooking || rated || date || filled === 'true' ? ` AND` : ` WHERE`;
  query += ` status <> 'temporary'`;

  // Optional sorting logic
  if (sort && sort === 'recent') {
    query += ` ORDER BY date DESC, TIME(LEFT(time, INSTR(time, '-') - 1)) DESC`; // Sort by most recent
  } else if (sort && sort === 'oldest') {
    query += ` ORDER BY date ASC, TIME(LEFT(time, INSTR(time, '-') - 1)) ASC`; // Sort by oldest
  }


  // Optional pagination logic
  if (limit) {
    const offset = (page ? (page - 1) * limit : 0); // Default offset to 0 if page is not provided
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), offset);
  }

  // Execute the query
  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching bookings:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    res.json(results); // Send the results as JSON
  });
});


// Get a Booking by idbookings
router.get("/onebooking/:idbookings", (req, res) => {
  const { idbookings } = req.params;

  // SQL query to fetch the booking by idbookings
  const query = `SELECT * FROM bookings WHERE idbookings = ?`;

  // Execute the query
  db.query(query, [idbookings], (err, results) => {
    if (err) {
      console.error('Error fetching booking:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    // Check if the booking was found
    if (results.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Send the booking details as JSON
    res.json(results[0]);
  });
});


// Get all bookings that include a specific player's idusers and have a score
router.get("/player/:idusers", (req, res) => {
  const { idusers } = req.params;

  // SQL query to fetch bookings where the player is involved and the score is not NULL
  const query = `
    SELECT * FROM bookings 
    WHERE score IS NOT NULL 
    AND (
      team_a_player_a = ? OR
      team_a_player_b = ? OR
      team_b_player_a = ? OR
      team_b_player_b = ?
    ) AND idbookings > 0
  `;

  // Execute the query with the player's idusers provided in four spots for each player position
  db.query(query, [idusers, idusers, idusers, idusers], (err, results) => {
    if (err) {
      console.error('Error fetching bookings:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    // Return the bookings that match the criteria
    res.json(results);
  });
});


// Join team route with spot availability check
router.post("/join/:idbookings", auth, (req, res) => {
  const { idbookings } = req.params;
  const { team, position,ranking,name,surname } = req.body; // Assume team is "A" or "B" and position is "a" or "b"
  const idusers = req.decoded.id;





  // Fetch the current booking and check if the spot is available
  const queryCheck = `SELECT team_a_player_a, team_a_player_b, team_b_player_a, team_b_player_b FROM bookings WHERE idbookings = ?`;

  db.query(queryCheck, [idbookings], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (!results.length) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = results[0];
    let spotAvailable = false;

    // Check if the selected spot is still available
    if (team === "A" && position === "a" && !booking.team_a_player_a) {
      spotAvailable = true;
    } else if (team === "A" && position === "b" && !booking.team_a_player_b) {
      spotAvailable = true;
    } else if (team === "B" && position === "a" && !booking.team_b_player_a) {
      spotAvailable = true;
    } else if (team === "B" && position === "b" && !booking.team_b_player_b) {
      spotAvailable = true;
    }

    // If the spot is already taken, return an error
    if (!spotAvailable) {
      return res.status(400).json({ error: 'Η θέση πλέον δεν είναι διαθέσιμη.' });
    }

    // If the spot is available, update the booking with the player
    let updateQuery = "";
    if (team === "A" && position === "a") {
      updateQuery = `UPDATE bookings SET team_a_player_a = ?, team_a_player_a_name=? , team_a_player_a_surname=? , team_a_player_a_added_by=? , team_a_player_a_ranking=?  WHERE idbookings = ?`;
    } else if (team === "A" && position === "b") {
      updateQuery = `UPDATE bookings SET team_a_player_b = ? , team_a_player_b_name=? , team_a_player_b_surname=? , team_a_player_b_added_by=? , team_a_player_b_ranking=?  WHERE idbookings = ?`;
    } else if (team === "B" && position === "a") {
      updateQuery = `UPDATE bookings SET team_b_player_a = ? , team_b_player_a_name=? , team_b_player_a_surname=? , team_b_player_a_added_by=? , team_b_player_a_ranking=?  WHERE idbookings = ?`;
    } else if (team === "B" && position === "b") {
      updateQuery = `UPDATE bookings SET team_b_player_b = ? , team_b_player_b_name=? , team_b_player_b_surname=? , team_b_player_b_added_by=? , team_b_player_b_ranking=?  WHERE idbookings = ?`;
    }

    // Execute the update query to join the team
    db.query(updateQuery, [idusers,name,surname,idusers,ranking, idbookings], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to join the team' });
      }

      return res.status(200).json({ success: 'Joined the team successfully' });
    });
  });
});

//remove yourself from booking
router.post("/cancel/:idbookings", auth, (req, res) => {
  const { idbookings } = req.params;
  const { id } = req.decoded;

  // Fetch the booking
  const querySelect = `SELECT * FROM bookings WHERE idbookings = ?`;
  
  db.query(querySelect, [idbookings], (err, results) => {
    if (err) return res.status(500).json({ error: 'Σφάλμα επικοινωνίας με τη βάση.' });

    const booking = results[0];
    if (!booking) {
      return res.status(404).json({ error: "Δε βρέθηκε η κράτηση." });
    }

 


    // Get the current date and time
    const now = new Date();

    // Parse booking date and time
    const bookingDate = new Date(booking.date); // e.g. 2024-03-22
    const timeSlots = booking.time.split(','); // Split multiple slots, e.g. ['13.00-14.30', '14.30-16.00']
    
    // Get the first slot's start time
    const firstSlot = timeSlots[0]; // '13.00-14.30'
    const startTime = firstSlot.split('-')[0]; // '13.00'

    // Combine the booking date with the start time
    const [hours, minutes] = startTime.split(':').map(Number);
    bookingDate.setHours(hours, minutes, 0, 0); // Set the booking date to the start time

    // Check if the cancellation is at least 6 hours before the start time
    const sixHoursBefore = new Date(bookingDate);
    sixHoursBefore.setHours(bookingDate.getHours() - 6);

    if (now > sixHoursBefore) {
      return res.status(400).json({ error: "Η ακύρωση πρέπει να γίνει τουλάχιστον 6 ώρες πριν από την έναρξη." });
    }


    const { team_a_player_a, team_a_player_b, team_b_player_a,
       team_b_player_b } = results[0];

    if ((!team_a_player_a || team_a_player_a == id) 
    && 
    (!team_a_player_b || team_a_player_b == id)  
  && (!team_b_player_a || team_b_player_a == id) 
  && (!team_b_player_b || team_b_player_b == id) ) 
  {
      // If all are null, delete the booking
      const queryDelete = `DELETE FROM bookings WHERE idbookings = ?`;
      db.query(queryDelete, [idbookings], (err, result) => {
        if (err) return res.status(500).json({ error: 'Σφάλμα διαγραφής της κράτησης.' });

        return res.status(200).json({ success: true, message: 'Επιτυχής ακύρωση.' });
      });
    } 

else {

    let fieldsToUpdate = {};
    
 // Determine which player spot the user occupies
 if (booking.team_a_player_a == id) {
  fieldsToUpdate = {
    team_a_player_a: null,
    team_a_player_a_name: null,
    team_a_player_a_surname: null,
    team_a_player_a_ranking: null,
    team_a_player_a_added_by: null
  };
} else if (booking.team_a_player_b == id) {
  fieldsToUpdate = {
    team_a_player_b: null,
    team_a_player_b_name: null,
    team_a_player_b_surname: null,
    team_a_player_b_ranking: null,
    team_a_player_b_added_by: null
  };
} else if (booking.team_b_player_a == id) {
  fieldsToUpdate = {
    team_b_player_a: null,
    team_b_player_a_name: null,
    team_b_player_a_surname: null,
    team_b_player_a_ranking: null,
    team_b_player_a_added_by: null
  };
} else if (booking.team_b_player_b == id) {
  fieldsToUpdate = {
    team_b_player_b: null,
    team_b_player_b_name: null,
    team_b_player_b_surname: null,
    team_b_player_b_ranking: null,
    team_b_player_b_added_by: null
  };
}  else {
      return res.status(400).json({ error: "Δε βρέθηκε το όνομά σας στην κράτηση." });
    }

  // Build the query dynamically based on fieldsToUpdate
  const fieldsToNullify = Object.keys(fieldsToUpdate).map(field => `${field} = NULL`).join(', ');
  const queryUpdate = `UPDATE bookings SET ${fieldsToNullify} WHERE idbookings = ?`;


    db.query(queryUpdate, [idbookings], (err, result) => {
      if (err) return res.status(500).json({ error: 'Σφάλμα επικοινωνίας με τη βάση' });

      res.status(200).json({ success: true, message: 'Επιτυχής ακύρωση' });
    });}

  });


});


//delelete booking
router.post("/delete/:idbookings", auth, (req, res) => {
  const { idbookings } = req.params;
  const { id: userId } = req.decoded; // Get the userId of the logged-in user

  // Fetch the booking
  const querySelect = `SELECT * FROM bookings WHERE idbookings = ?`;
  
  db.query(querySelect, [idbookings], (err, results) => {
    if (err) return res.status(500).json({ error: "Σφάλμα επικοινωνίας με τη βάση." });

    const booking = results[0];
    if (!booking) {
      return res.status(404).json({ error: "Δε βρέθηκε η κράτηση." });
    }

    // Check if the logged-in user made the booking and if the booking is "Κλειστό"
    if (booking.userId !== userId) {
      return res.status(403).json({ error: "Δεν είστε ο δημιουργός της κράτησης." });
    }

    if (booking.typeOfBooking !== "Κλειστό") {
      return res.status(403).json({ error: "Η κράτηση δεν είναι Κλειστή, δεν μπορείτε να την διαγράψετε." });
    }

    
    // Get the current date and time
    const now = new Date();

    // Parse booking date and time
    const bookingDate = new Date(booking.date); // e.g. 2024-03-22
    const timeSlots = booking.time.split(','); // Split multiple slots, e.g. ['13.00-14.30', '14.30-16.00']
    
    // Get the first slot's start time
    const firstSlot = timeSlots[0]; // '13.00-14.30'
    const startTime = firstSlot.split('-')[0]; // '13.00'

    // Combine the booking date with the start time
    const [hours, minutes] = startTime.split(':').map(Number);
    bookingDate.setHours(hours, minutes, 0, 0); // Set the booking date to the start time

    // Check if the cancellation is at least 6 hours before the start time
    const sixHoursBefore = new Date(bookingDate);
    sixHoursBefore.setHours(bookingDate.getHours() - 6);

    if (now > sixHoursBefore) {
      return res.status(400).json({ error: "Η ακύρωση πρέπει να γίνει τουλάχιστον 6 ώρες πριν από την έναρξη." });
    }


    // If both conditions pass, delete the booking
    const queryDelete = `DELETE FROM bookings WHERE idbookings = ?`;

    db.query(queryDelete, [idbookings], (err, result) => {
      if (err) return res.status(500).json({ error: "Σφάλμα επικοινωνίας με τη βάση." });

      res.status(200).json({ success: true, message: "Η κράτηση διαγράφηκε επιτυχώς." });
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