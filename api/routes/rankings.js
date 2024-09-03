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
    


module.exports = router;