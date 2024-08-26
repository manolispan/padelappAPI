const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../../database/db.js");
const jwt = require("jsonwebtoken");
const transport = require("../../nodemailer/nodemailertrans");
const loggersignin =require("../../winston/loggersignin");
const { OAuth2Client } = require('google-auth-library');
//const CLIENT_ID = "634317435388-f01paqk8lq0qtq8famopndvje333mkl0.apps.googleusercontent.com"
const CLIENT_ID = "116733366795-93qtatkmuqm2d9p6l5n7m50lub50kq3c.apps.googleusercontent.com"
const client = new OAuth2Client(CLIENT_ID);

router.post("/schools", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    "SELECT contactpic,profilepic,biopic,videos,gold,diamond,elite,Likes,Όνομα,idschools,Coordinates,ExtraDances,Άλλα,Ενοικίαση,Κωδικός,Ιστοσελίδα,Email,ΔιαθέσιμηΑίθουσα,ΜέγεθοςΑίθουσας,image,ΑνώτερεςΣχολές,Διεύθυνση,Πτυχία,Τηλέφωνο,Περιοχή,Προάστια,Πόλη,ΤΚ,Χοροί,Κυριακή,Δευτέρα,Τρίτη,Τετάρτη,Πέμπτη,Παρασκευή,Σάββατο,Facebook,Instagram,Info,Πρόγραμμα,ProfileColors,FavoriteTeachers,FavoriteSchools,FavoriteOmades,ΠρόγραμμαΦώτο FROM schools WHERE Email=? AND Validated=1",
    email,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      console.log(result);
      if (result.length > 0) {
        bcrypt.compare(password, result[0].Κωδικός, (error, response) => {
          if (response) {
            const token = jwt.sign(
              {
                email: result[0].Email,
                id: result[0].idschools,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "12h",
              }
            );
            result[0].token = token;
            result[0].Κωδικός = "";
            loggersignin.log("info", "NewLogin School "+ 
            JSON.stringify(result[0].Όνομα)+JSON.stringify(result[0].idschools));
            res.send(result);
          } else {
            res.send({ message: "Δε βρέθηκε ο συνδυασμός" });
          }
        });
      } else {
        res.send({ message: "Δε βρέθηκε ο συνδυασμός" });
      }
    }
  );
});

router.post("/teachers", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    "SELECT videos,gold,diamond,elite,Likes,Όνομα,id,Κωδικός,Ηλικία,Email,Performer,Άλλα,image,Επίθετο,Περιοχές,Πόλη,Προυπηρεσία,Πτυχία,Τηλέφωνο,Φύλο,Χοροί,Βιογραφικό,Κυριακή,Δευτέρα,Τρίτη,Τετάρτη,Πέμπτη,Παρασκευή,Σάββατο,Κωδικός,Ιστοσελίδα,Facebook,Instagram,Linkedin,ProfileColors,FavoriteTeachers,FavoriteSchools,FavoriteOmades,contactpic,profilepic,biopic FROM teachers WHERE Email=? AND Validated=1",
    email,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].Κωδικός, (error, response) => {
          if (response) {
            // req.session.user=result;
            const token = jwt.sign(
              {
                email: result[0].Email,
                id: result[0].id,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "240h",
              }
            );
            result[0].token = token;
            result[0].Κωδικός = "";
            loggersignin.log("info", "NewLogin Teacher "+ 
            JSON.stringify(result[0].Όνομα)+JSON.stringify(result[0].id));
            res.send(result);
          } else {
            res.send({ message: "Δε βρέθηκε ο συνδυασμός" });
          }
        });
      } else {
        res.send({ message: "Δε βρέθηκε ο συνδυασμός" });
      }
    }
  );
});

router.post("/visitors", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    "SELECT  Βιογραφικό,Όνομα,Κωδικός,Επίθετο,Διεύθυνση,PostalCode,Περιοχή,Προάστια,Πόλη,Coordinates,Email,idvisitors,FavoriteSchools,FavoriteTeachers,FavoriteOmades,Instagram,Facebook,visible,Χοροί,image FROM visitors WHERE Email=? AND Validated=1",
    email,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      console.log(result);
      if (result.length > 0) {
        bcrypt.compare(password, result[0].Κωδικός, (error, response) => {
          if (response) {
            const token = jwt.sign(
              {
                email: result[0].Email,
                id: result[0].idvisitors,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "240h",
              }
            );
            result[0].token = token;
            result[0].Κωδικός = "";
            loggersignin.log("info", "NewLogin Visitor "+ 
            JSON.stringify(result[0].Όνομα)+JSON.stringify(result[0].idvisitors));
            res.send(result);
          } else {
            res.send({ message: "Δε βρέθηκε ο συνδυασμός" });
          }
        });
      } else {
        res.send({ message: "Δε βρέθηκε ο συνδυασμός" });
      }
    }
  );
});

router.post("/foreis", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    "SELECT  * FROM foreis WHERE Email=? AND Validated=1",
    email,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      console.log(result);
      if (result.length > 0) {
        bcrypt.compare(password, result[0].Κωδικός, (error, response) => {
          if (response) {
            const token = jwt.sign(
              {
                email: result[0].Email,
                id: result[0].idforeis,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "240h",
              }
            );
            result[0].token = token;
            result[0].Κωδικός = "";
            loggersignin.log("info", "NewLogin Foreis "+ 
            JSON.stringify(result[0].Όνομα)+JSON.stringify(result[0].idforeis));
            res.send(result);
          } else {
            res.send({ message: "Δε βρέθηκε ο συνδυασμός" });
          }
        });
      } else {
        res.send({ message: "Δε βρέθηκε ο συνδυασμός" });
      }
    }
  );
});

router.post("/omades", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    "SELECT  * FROM omades WHERE Email=? AND Validated=1",
    email,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      console.log(result);
      if (result.length > 0) {
        bcrypt.compare(password, result[0].Κωδικός, (error, response) => {
          if (response) {
            const token = jwt.sign(
              {
                email: result[0].Email,
                id: result[0].idomad,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "240h",
              }
            );
            result[0].token = token;
            result[0].Κωδικός = "";
            loggersignin.log("info", "NewLogin Omada "+ 
            JSON.stringify(result[0].Όνομα)+JSON.stringify(result[0].idomad));
            res.send(result);
          } else {
            res.send({ message: "Δε βρέθηκε ο συνδυασμός" });
          }
        });
      } else {
        res.send({ message: "Δε βρέθηκε ο συνδυασμός" });
      }
    }
  );
});


router.post("/resetpassword", (req, res) => {
  const Email = req.body.email;
  const type = req.body.type;

  const EncryptedMail = jwt.sign(
    { email: Email },
    process.env.JWT_SECRET_MAIL,
    { expiresIn: "5h" }
  );

  db.query(`SELECT * FROM ${type} WHERE Email=? `, [Email], (err, result) => {
    if (err) {
      console.log(err);
      res.send({
        continue: -1,
        message: "Κάτι πήγε στραβά",
      });
    } else if (result.length > 0) {
      transport
        .sendMail({
          from: process.env.USE_MAIL,
          to: Email,
          subject: "Επαναφορά Κωδικού",
          html: `<h1>Ξέχασα τον Κωδικό μου</h1>
    <p>Λυπούμαστε που ξεχάσατε τον κωδικό σας! Πατήστε στο παρακάτω λινκ ώστε να βάλετε νέο κωδικό</p>
    <a href=${process.env.ACCEPTED_URL}/pswrdreset/${type}?token=${EncryptedMail}> Πατήστε Εδώ</a>
    <div>Σε περίπτωση που δεν στείλατε εσείς αίτημα για αλλαγή κωδικού παρακαλώ επικοινωνήστε μαζί μας.</div>
    </div>`,
        })
        .catch((err) => console.log(err));
      res.send({
        continue: 1,
        message: "Το email εστάλη",
      });
    } else {
      res.send({
        continue: 0,
        message: "Δε βρέθηκε το email που δηλώσατε",
      });
    }
  });
});




router.post("/google/teachers", (req, res) => {

  let token= req.body.token.credential;
  console.log(token)
  
  async function verify() {
      try {
  const ticket = await client.verifyIdToken({
              idToken: token,
              audience: CLIENT_ID, 
          });
          const payload = ticket.getPayload();
         // const userid = payload['sub'];
          let email=payload.email;

          db.query(
            "SELECT Likes,Όνομα,id,Κωδικός,Ηλικία,Email,Performer,Άλλα,image,Επίθετο,Περιοχές,Πόλη,Προυπηρεσία,Πτυχία,Τηλέφωνο,Φύλο,Χοροί,Βιογραφικό,Κυριακή,Δευτέρα,Τρίτη,Τετάρτη,Πέμπτη,Παρασκευή,Σάββατο,Κωδικός,Ιστοσελίδα,Facebook,Instagram,Linkedin,ProfileColors,FavoriteTeachers,FavoriteSchools,FavoriteOmades FROM teachers WHERE Email=? AND Validated=1",
            email,
            (err, result) => {
              if (err) {
                res.send({ err: err });
              }
        
              if (result.length > 0) {
                const token = jwt.sign(
                  {
                    email: result[0].Email,
                    id: result[0].id,
                  },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: "240h",
                  }
                );
                result[0].token = token;
                result[0].Κωδικός = "";
                loggersignin.log("info", "NewLogin Teacher "+ 
                JSON.stringify(result[0].Όνομα)+JSON.stringify(result[0].id));
                res.send(result);
              } else {
                res.send({ message: "Δε βρέθηκε ο συνδυασμός" });
              }
            }
          );




      } catch (error) {
          console.log(error);
          res.send({ message: "Δε βρέθηκε ο συνδυασμός" });
      }
  }
  verify()

});


router.post("/google/schools", (req, res) => {

  let token= req.body.token.credential;
  
  async function verify() {
      try {
  const ticket = await client.verifyIdToken({
              idToken: token,
              audience: CLIENT_ID, 
          });
          const payload = ticket.getPayload();
         // const userid = payload['sub'];
          let email=payload.email;
          db.query(
            "SELECT Likes,Όνομα,idschools,Coordinates,ExtraDances,Άλλα,Ενοικίαση,Κωδικός,Ιστοσελίδα,Email,ΔιαθέσιμηΑίθουσα,ΜέγεθοςΑίθουσας,image,ΑνώτερεςΣχολές,Διεύθυνση,Πτυχία,Τηλέφωνο,Περιοχή,Προάστια,Πόλη,ΤΚ,Χοροί,Κυριακή,Δευτέρα,Τρίτη,Τετάρτη,Πέμπτη,Παρασκευή,Σάββατο,Facebook,Instagram,Info,Πρόγραμμα,ProfileColors,FavoriteTeachers,FavoriteSchools,FavoriteOmades,ΠρόγραμμαΦώτο FROM schools WHERE Email=? AND Validated=1",
            email,
            (err, result) => {
              if (err) {
                res.send({ err: err });
              }
        
              if (result.length > 0) {
                const token = jwt.sign(
                  {
                    email: result[0].Email,
                    id: result[0].idschools,
                  },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: "240h",
                  }
                );
                result[0].token = token;
                result[0].Κωδικός = "";
                loggersignin.log("info", "NewLogin School "+ 
                JSON.stringify(result[0].Όνομα)+JSON.stringify(result[0].idschools));
                res.send(result);
              } else {
                res.send({ message: "Δε βρέθηκε ο συνδυασμός" });
              }
            }
          );




      } catch (error) {
          console.log(error);
          res.send({ message: "Δε βρέθηκε ο συνδυασμός" });
      }
  }
  verify()

});


router.post("/google/visitors", (req, res) => {

  let token= req.body.token.credential;
 
  async function verify() {
      try {
  const ticket = await client.verifyIdToken({
              idToken: token,
              audience: CLIENT_ID, 
          });
          const payload = ticket.getPayload();
         // const userid = payload['sub'];
          let email=payload.email;
          db.query(
            "SELECT  Όνομα,Κωδικός,Επίθετο,Διεύθυνση,PostalCode,Περιοχή,Προάστια,Πόλη,Coordinates,Email,idvisitors,FavoriteSchools,FavoriteTeachers,FavoriteOmades,Instagram,Facebook,visible,Χοροί,image FROM visitors WHERE Email=? AND Validated=1",
            email,
            (err, result) => {
              if (err) {
                res.send({ err: err });
              }
        
              if (result.length > 0) {
                const token = jwt.sign(
                  {
                    email: result[0].Email,
                    id: result[0].idvisitors,
                  },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: "240h",
                  }
                );
                result[0].token = token;
                result[0].Κωδικός = "";
                loggersignin.log("info", "NewLogin Visitor "+ 
                JSON.stringify(result[0].Όνομα)+JSON.stringify(result[0].idvisitors));
                res.send(result);
              } else {
                res.send({ message: "Δε βρέθηκε ο συνδυασμός" });
              }
            }
          );




      } catch (error) {
          console.log(error);
          res.send({ message: "Δε βρέθηκε ο συνδυασμός" });
      }
  }
  verify()

});


router.post("/google/foreis", (req, res) => {

  let token= req.body.token.credential;
  
  async function verify() {
      try {
  const ticket = await client.verifyIdToken({
              idToken: token,
              audience: CLIENT_ID, 
          });
          const payload = ticket.getPayload();
         // const userid = payload['sub'];
          let email=payload.email;
          db.query(
            "SELECT  * FROM foreis WHERE Email=? AND Validated=1",
    email,
            (err, result) => {
              if (err) {
                res.send({ err: err });
              }
        
              if (result.length > 0) {
                const token = jwt.sign(
                  {
                    email: result[0].Email,
                    id: result[0].idforeis,
                  },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: "240h",
                  }
                );
                result[0].token = token;
                result[0].Κωδικός = "";
                loggersignin.log("info", "NewLogin Visitor "+ 
                JSON.stringify(result[0].Όνομα)+JSON.stringify(result[0].idforeis));
                res.send(result);
              } else {
                res.send({ message: "Δε βρέθηκε ο συνδυασμός" });
              }
            }
          );




      } catch (error) {
          console.log(error);
          res.send({ message: "Δε βρέθηκε ο συνδυασμός" });
      }
  }
  verify()

});







// router.get("/:type/:hashedEmail", async (req, res) => {
//   const hashedEmail = req.params.hashedEmail;
//   const type=req.params.type;

//   const Email = jwt.verify(hashedEmail, process.env.JWT_SECRET_MAIL);

// console.log(Email);

// });

router.post("/newpassword", (req, res) => {
  const token = req.body.token;
  const type = req.body.type;
  const newPass = req.body.newPass;

  const Email = jwt.verify(token, process.env.JWT_SECRET_MAIL).email;

  bcrypt.hash(newPass, parseInt(process.env.BCRYPT_SALTROUNDS), (err, hash) => {
    if (err) {
      console.log(err);
    }
    db.query(
      `UPDATE ${type} SET Κωδικός=? WHERE Email=?`,
      [hash, Email],
      (err, result) => {
        /* console.log(req.body); */
        if (err) {
          console.log(err);
          res.send({
            continue: 0,
            message: "Κάτι πήγε στραβά",
          });
        } else {
          res.send({
            continue: 1,
            message: "Επιτυχία",
          });
        }
      }
    );
  });
});

module.exports = router;
