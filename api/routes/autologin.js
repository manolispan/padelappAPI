const express = require("express");
const router = express.Router();
const db = require("../../database/db.js");
const auth = require("../../middleware/auth");




router.post("/teachers", auth, (req, res) => {
  

  db.query(
    "SELECT videos,gold,diamond,elite,Likes,Όνομα,id,Κωδικός,Ηλικία,Άλλα,Email,Performer,image,Επίθετο,Περιοχές,Πόλη,Προυπηρεσία,Πτυχία,Τηλέφωνο,Φύλο,Χοροί,Βιογραφικό,Κυριακή,Δευτέρα,Τρίτη,Τετάρτη,Πέμπτη,Παρασκευή,Σάββατο,Ιστοσελίδα,Facebook,Instagram,Linkedin,ProfileColors,FavoriteTeachers,FavoriteSchools,FavoriteOmades,profilepic,biopic,contactpic FROM teachers  WHERE Email=? AND id=?",
    [req.decoded.email, req.decoded.id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result[0]);
      }
    }
  );
});

router.post("/schools", auth, (req, res) => {
  

  db.query(
    "SELECT contactpic,profilepic,biopic,videos,gold,diamond,elite,Likes,Όνομα,idschools,Coordinates,Ενοικίαση,ExtraDances,Άλλα,ΠρόγραμμαΦώτο,Ιστοσελίδα,Email,ΔιαθέσιμηΑίθουσα,ΜέγεθοςΑίθουσας,image,ΑνώτερεςΣχολές,Διεύθυνση,Πτυχία,Τηλέφωνο,Περιοχή,Προάστια,Πόλη,ΤΚ,Χοροί,Κυριακή,Δευτέρα,Τρίτη,Τετάρτη,Πέμπτη,Παρασκευή,Σάββατο,Facebook,Instagram,Info,Πρόγραμμα,ProfileColors,FavoriteTeachers,FavoriteSchools,FavoriteOmades FROM schools  WHERE Email=? AND idschools=?",
    [req.decoded.email,req.decoded.id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result[0]);
      }
    }
  );
});


router.post("/visitors", auth, (req, res) => {

  db.query(
    "SELECT Βιογραφικό,Όνομα,Επίθετο,Διεύθυνση,PostalCode,Περιοχή,Προάστια,Πόλη,Coordinates,idvisitors,FavoriteSchools,FavoriteTeachers,FavoriteOmades,Email,Χοροί,Instagram,Facebook,visible,image FROM visitors  WHERE Email=? AND idvisitors=?",
    [req.decoded.email,req.decoded.id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result[0]);
      }
    }
  );
});


router.post("/foreis", auth, (req, res) => {

  db.query(
    "SELECT * FROM foreis  WHERE Email=? AND idforeis=?",
    [req.decoded.email,req.decoded.id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result && result[0])
       { result[0].Κωδικός="";}
        res.send(result[0]);
      }
    }
  );
});


router.post("/omades", auth, (req, res) => {

  db.query(
    "SELECT * FROM omades  WHERE Email=? AND idomad=?",
    [req.decoded.email,req.decoded.id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result && result[0])
       { result[0].Κωδικός="";}
        res.send(result[0]);
      }
    }
  );
});

module.exports = router;
