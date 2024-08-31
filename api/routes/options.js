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



router.get("/getall", (req, res) => {
  db.query("SELECT * FROM options",(err,result)=>{
  if (err) {
      console.log(err)    }
      else { 
          res.send(result)
      }}
  )
})



  

module.exports = router;