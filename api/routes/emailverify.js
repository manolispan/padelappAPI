const express =require('express');
const router=express.Router();
const db= require('../../database/db.js');
const logger =require("../../winston/logger");


router.get("/emailcheckteachers/:email", async(req, res) => {
const email=req.params.email;

  db.query("SELECT * FROM teachers  WHERE Email=? AND Validated=1",
  [email]
  ,(err,result)=>{
  if (err) {
      console.log(err);
      logger.log("error", "error in checking mail"+ JSON.stringify(error));
    }
    else if (result.length>0){ 
            console.log("ekaneelegxomail");
            logger.log("info", "Υπάρχει ήδη λογαριασμός με αυτό το email");
          res.send({
                continue : 0,
            message : "Υπάρχει ήδη λογαριασμός με αυτό το email"});
            
      }
    else {
      logger.log("info", "Περασε απο emailcheck");
        res.send({continue : 1})
    }
    }
  )
})


router.get("/emailcheckschools/:email", async(req, res) => {
  const email=req.params.email;
  
    db.query("SELECT * FROM schools  WHERE Email=? AND Validated=1",
    [email,email]
    ,(err,result)=>{
    if (err) {
        console.log(err);
        logger.log("error", "error in checking mail"+ JSON.stringify(error));    }
      else if (result.length>0){ 
              console.log("ekaneelegxomail");
              logger.log("info", "Υπάρχει ήδη λογαριασμός με αυτό το email");
            res.send({
                  continue : 0,
              message : "Υπάρχει ήδη λογαριασμός με αυτό το email"});
              
        }
      else {
        logger.log("info", "Περασε απο emailcheck");
          res.send({continue : 1})
      }
      }
    )
  })

  router.get("/emailcheckvisitors/:email", async(req, res) => {
    const email=req.params.email;
    
      db.query("SELECT * FROM visitors  WHERE Email=? AND Validated=1",
      [email,email]
      ,(err,result)=>{
      if (err) {
          console.log(err);
          logger.log("error", "error in checking mail"+ JSON.stringify(error));    }
        else if (result.length>0){ 
                console.log("ekaneelegxomail");
                logger.log("info", "Υπάρχει ήδη λογαριασμός με αυτό το email");
              res.send({
                    continue : 0,
                message : "Υπάρχει ήδη λογαριασμός με αυτό το email"});
                
          }
        else {
          logger.log("info", "Περασε απο emailcheck");
            res.send({continue : 1})
        }
        }
      )
    })

  router.get("/emailcheckomades/:email", async(req, res) => {
    const email=req.params.email;
    
      db.query("SELECT * FROM omades  WHERE Email=? AND Validated=1",
      [email,email]
      ,(err,result)=>{
      if (err) {
          console.log(err);
          logger.log("error", "error in checking mail"+ JSON.stringify(error));    }
        else if (result.length>0){ 
                console.log("ekaneelegxomail");
                logger.log("info", "Υπάρχει ήδη λογαριασμός με αυτό το email");
              res.send({
                    continue : 0,
                message : "Υπάρχει ήδη λογαριασμός με αυτό το email"});
                
          }
        else {
          logger.log("info", "Περασε απο emailcheck");
            res.send({continue : 1})
        }
        }
      )
    })

  router.get("/emailcheckall/:email", async(req, res) => {
    const email=req.params.email;
/*     let accounts = {
      schools : [],
      teachers : [],
      visitors : [],
      omades : []
    } */
   
    
      db.query("SELECT * FROM omades  WHERE Email=? AND Validated=1",
      [email,email]
      ,(err,result)=>{
      if (err) {
          console.log(err); }
        else { 
            /*     if (result.length>0)
               {accounts.omades = result[0];
              number = 0;
              } */


      db.query("SELECT * FROM teachers  WHERE Email=? AND Validated=1",
      [email,email]
      ,(err1,result1)=>{
      if (err) {
          console.log(err1);}
        else { 
        /*        if (result1.length>0)
                {accounts.teachers = result1[0] 
            } */

               db.query("SELECT * FROM schools  WHERE Email=? AND Validated=1",
               [email,email]
               ,(err2,result2)=>{
               if (err) {
                   console.log(err2);}
                 else { 
                      /*   if (result2.length>0)
                        {accounts.schools = result2[0]} */

                        db.query("SELECT * FROM visitors  WHERE Email=? AND Validated=1",
                        [email,email]
                        ,(err3,result3)=>{
                        if (err) {
                            console.log(err3);}
                          else { 
                               /*   if (result3.length>0)
                                 {accounts.visitors = result3[0]
                                number=0} */
                            
                                 if ((result.length>0)|| (result1.length>0)|| (result2.length>0) || (result3.length>0))
                               
                                {res.send({continue : 0})}
                                else 
                                {
                                  res.send({continue : 1})

                                }
                            }
                  
                          }
                        ) 
                       
                   }
         
                 }
               ) 
          }

        }
      )








          }

        }
      )
    })


router.get("/teachers/:ValidateMail", (req, res) => {
  const ValidateMail=req.params.ValidateMail; 
    db.query("UPDATE teachers SET Validated=1 WHERE ValidateMail=?",
    [ValidateMail]
    ,  (err, result) => {
      console.log(req.body);
    if (err) {
      console.log(err);
    } else {
      res.redirect(process.env.ACCEPTED_URL+'/welcomepage');
    }
  }
    )
  })

  router.get("/schools/:ValidateMail", (req, res) => {
    const ValidateMail=req.params.ValidateMail; 
      db.query("UPDATE schools SET Validated=1 WHERE ValidateMail=?",
      [ValidateMail]
      ,  (err, result) => {
        console.log(req.body);
      if (err) {
        console.log(err);
      } else {
        res.redirect(process.env.ACCEPTED_URL+'/welcomepage');
      }
    }
      )
    })

    router.get("/visitors/:ValidateMail", (req, res) => {
      const ValidateMail=req.params.ValidateMail; 
        db.query("UPDATE visitors SET Validated=1 WHERE ValidateMail=?",
        [ValidateMail]
        ,  (err, result) => {
          console.log(req.body);
        if (err) {
          console.log(err);
        } else {
          res.redirect(process.env.ACCEPTED_URL+'/welcomepage');
        }
      }
        )
      })
  


module.exports = router;