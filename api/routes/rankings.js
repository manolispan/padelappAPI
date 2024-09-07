const express =require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const multer= require('multer');
const sharp=require('sharp');
const fs = require('fs');
const db=require('../../database/db.js')
const jwt = require("jsonwebtoken");
const transport= require('../../nodemailer/nodemailertrans.js');
const auth = require("../../middleware/auth.js");
const logger =require("../../winston/logger.js");

/* 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const token =req.body.token 
    const id=req.body.id
    
    if (!token) {
      cb(new Error("A token is required for authentication"), false);
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.decoded = decoded;
    } catch (err) {
      return res.status(403).send("Not valid token");
    }
    const dest = './uploads/teachersuploads/'+ id
    if (fs.existsSync(dest)) {
      console.log('Directory exists!');}
    else {
      fs.mkdirSync(dest,{ recursive: true });
      console.log('Directory created!');
    }

    cb(null,dest)
  },
  filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:|\./g,'') + file.originalname);
      },

  })




const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" 
  ) {
    cb(null, true);
  } else {
    cb(new Error('Wrong file type'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter:fileFilter

}); */
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

router.post("/", auth, (req, res) => {
const iduser = req.decoded.id;

  db.query("SELECT * FROM rankings WHERE iduser=?",[iduser],(err,result)=>{
  if (err) {
      console.log(err)    }
      else { 
          res.send(result)
      }}
  )
})


router.get("/timeslots", (req, res) => {
    db.query("SELECT * FROM timetable_restrictions",(err,result)=>{
    if (err) {
        console.log(err)    }
        else { 
            res.send(result)
        }}
    )
  })

  

  router.post("/getone/:iduser", auth, (req, res) => {
    const iduser = req.params.iduser

  
    
      db.query("SELECT * FROM rankings WHERE iduser=?",[iduser],(err,result)=>{
      if (err) {
          console.log(err)    }
          else { 
            
              res.send(result)
          }}
      )
    })
    
    router.put("/changerating", auth, (req, res) => {
     
      console.log(req.body)
 const date = Date.now();
 const dateFormatted= formatDate(date)
const rating=req.body.rating
    
      
      db.query(
          
        "UPDATE users SET ranking=? WHERE idusers=?",
        [rating,req.decoded.id],
        (err, result) => {
            /* console.log(req.body); */
          if (err) {
            console.log(err);
          } else {
            
            db.query(
          
              "INSERT INTO rankings (iduser,rating,date) VALUES  (?,?,?)",
              [req.decoded.id,rating,dateFormatted],
              (err, result) => {
                  /* console.log(req.body); */
                if (err) {
                  console.log(err);
                } else {
                  res.send("Values inserted");
                }
              }
            );

          }
        }
      );
      
    
    
    
    
    });
    

module.exports = router;