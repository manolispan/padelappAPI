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

});

 

 

  router.post("/register", (req, res) => {
   
 

    const password = req.body.password;
    const email = req.body.email;
    const name = req.body.name;
    const address = req.body.address;
    const photo = req.body.photo;
    const phone = req.body.phone;
    const position = req.body.position;
    const age = req.body.age;
    const gender = req.body.gender
    const registered_at = Date.now();





  
  bcrypt.hash(password,parseInt(process.env.BCRYPT_SALTROUNDS), 
  (err,hash)=>
  {if (err) { console.log(err);
   
  }  
    db.query(
        
      "INSERT INTO users (gender,password,email,name,address,phone,photo,position,age,registered_at) VALUES  (?,?,?,?,?,?,?,?,?,?)",
      [gender,hash,email,name,address,phone,photo,position,age,registered_at],
      (err, result) => {
          /* console.log(req.body); */
        if (err) { 
          console.log(err);
        } else {
          res.send(result.insertId.toString());
          
        }
      }
    );
  }  
  )



  });
  



  router.get("/", (req, res) => {
    db.query("SELECT videos,gold,diamond,elite,Likes,Όνομα,Τροποποίηση,ΗμερομηνίαΕγγραφής,image,Πόλη,Επίθετο,Ηλικία,Άλλα,Φύλο,Περιοχές,Πτυχία,Χοροί,id,Κυριακή,Δευτέρα,Τρίτη,Τετάρτη,Πέμπτη,Παρασκευή,Σάββατο,Προυπηρεσία,Performer,ProfileColors,id,profilepic,contactpic,biopic FROM teachers WHERE VALIDATED=1",(err,result)=>{
    if (err) {
        console.log(err)    }
        else { 
            res.send(result)
        }}
    )
})


router.get("/:id", (req, res) => {
  const id=req.params.id;
 

  db.query("SELECT videos,gold,diamond,elite,Likes,Όνομα,Ηλικία,Άλλα,Performer,image,Επίθετο,Περιοχές,Πόλη,Προυπηρεσία,Πτυχία,Τηλέφωνο,Φύλο,Χοροί,Βιογραφικό,Κυριακή,Δευτέρα,Τρίτη,Τετάρτη,Πέμπτη,Παρασκευή,Σάββατο,Ιστοσελίδα,Facebook,Instagram,Linkedin,ProfileColors,id,biopic,profilepic,contactpic FROM teachers  WHERE id=? AND Validated=1",
  [id]
  ,(err,result)=>{
  if (err) {
      console.log(err)    }
      else { 
          res.send(result);
          console.log("sentresults")
      }}
  )
})



router.put("/:id", auth, (req, res) => {
  const id=req.params.id;
  const Όνομα = req.body.Όνομα;
  const Ηλικία = req.body.Ηλικία;
  const Email = req.body.Email;
  const Κωδικός=req.body.Κωδικός;
  const Επίθετο = req.body.Επίθετο;
  const Performer = req.body.Performer;
  const Περιοχές = req.body.Περιοχές.join(',');
  const Τηλέφωνο = req.body.Τηλέφωνο;
  const Προυπηρεσία= req.body.Προυπηρεσία;
  const Φύλο = req.body.Φύλο;
  const Χοροί = req.body.Χοροί.join(',');
  const Βιογραφικό= req.body.Βιογραφικό;
  const Πτυχία=req.body.Πτυχία.join(',');
  const Ιστοσελίδα=req.body.Ιστοσελίδα;
  const Facebook=req.body.Facebook;
  const Instagram=req.body.Ιnstagram;
  const Linkedin=req.body.Linkedin;
  const Πόλη = req.body.Πόλη;
  const Άλλα=req.body.Άλλα.join(',');
  const Τροποποίηση =  Date.now();

  const Κυριακή2 = [];
  const Δευτέρα2 = [];
  const Τρίτη2 = [];
  const Τετάρτη2 = [];
  const Πέμπτη2 = [];
  const Παρασκευή2 = [];
  const Σάββατο2 = [];
  

  for (const [key, value] of Object.entries(req.body.Διαθεσιμότητα.Κυριακή)) {
    if (value === true) {
     Κυριακή2.push(key);
    }
  }

  for (const [key, value] of Object.entries(req.body.Διαθεσιμότητα.Δευτέρα)) {
    if (value === true) {
      Δευτέρα2.push(key);
    }
  }

  for (const [key, value] of Object.entries(req.body.Διαθεσιμότητα.Τρίτη)) {
    if (value === true) {
      Τρίτη2.push(key);
    }
  }
  for (const [key, value] of Object.entries(req.body.Διαθεσιμότητα.Τετάρτη)) {
    if (value === true) {
      Τετάρτη2.push(key);
    }
  }

  for (const [key, value] of Object.entries(req.body.Διαθεσιμότητα.Πέμπτη)) {
    if (value === true) {
      Πέμπτη2.push(key);
    }
  }

  for (const [key, value] of Object.entries(req.body.Διαθεσιμότητα.Παρασκευή)) {
    if (value === true) {
      Παρασκευή2.push(key);
    }
  }

  for (const [key, value] of Object.entries(req.body.Διαθεσιμότητα.Σάββατο)) {
    if (value === true) {
      Σάββατο2.push(key);
    }
  }

  const Κυριακή=Κυριακή2.join(',');
    
  

const Δευτέρα=Δευτέρα2.join(',');


 const Τρίτη=Τρίτη2.join(',');

const Τετάρτη=Τετάρτη2.join(',');

 const Πέμπτη=Πέμπτη2.join(',');

const Παρασκευή=Παρασκευή2.join(',');

const Σάββατο=Σάββατο2.join(',');


  
  db.query(
      
    "UPDATE teachers SET Τροποποίηση=?, Όνομα=?, Άλλα=?, Ηλικία=?, Email=?, Performer=?, Επίθετο=?, Περιοχές=?, Πόλή=? , Προυπηρεσία=?, Πτυχία=?, Τηλέφωνο=?, Φύλο=?, Χοροί=?, Βιογραφικό=?, Κυριακή=?, Δευτέρα=?, Τρίτη=?, Τετάρτη=?, Πέμπτη=?, Παρασκευή=?, Σάββατο=?, Ιστοσελίδα=?, Facebook=?, Instagram=?, Linkedin=? WHERE id=? AND Email=?",
    [Τροποποίηση,Όνομα,Άλλα,Ηλικία,Email,Performer,Επίθετο,Περιοχές,Πόλη,Προυπηρεσία,Πτυχία,Τηλέφωνο,Φύλο,Χοροί,Βιογραφικό,
        Κυριακή,Δευτέρα,Τρίτη,Τετάρτη,Πέμπτη,Παρασκευή,Σάββατο,Ιστοσελίδα,Facebook,Instagram,Linkedin,id,req.decoded.email],
    (err, result) => {
        /* console.log(req.body); */
      if (err) {
        console.log(err);
      } else {
        res.send("Values inserted");
      }
    }
  );
  




});




router.put("/changephotos/:id",upload.array('teacherImage') ,
async (req, res) => {
  const id=req.params.id;
  const oldphotos = req.body.oldphotos;
  const Όνομα=req.body.Όνομα;
  const photostodeletetext= req.body.photosToDelete.replaceAll(process.env.THIS_DOMAIN1,"/var/www/vhosts/dancelink.online/DanceLinkBackend/uploads");
  const photosToDelete=photostodeletetext.split(",");
  const oldColors= req.body.oldColors;
  const ProfileColorsnew=req.body.ProfileColors;
  const Τροποποίηση =  Date.now();
  
		
	
  let imagepaths=[];
  for (let i=0; i< req.files.length; i++) {
    imagepaths[i]=process.env.THIS_DOMAIN+req.files[i].path;
    sharp(req.files[i].path)
    .resize({ width: 260,
    height:370 })
    .toFile(
      req.files[i].path.replace(/.jpg|.png|.jpeg/g, function (x) {
        return "card" + x;
      })
    );
    sharp(req.files[i].path)
    .resize({width:150, height:100 })
    .toFile(
      req.files[i].path.replace(/.jpg|.png|.jpeg/g, function (x) {
        return "thumbnail" + x;
      })
    );

    sharp(req.files[i].path)
    .resize({width: 290, height:290 })
    .toFile(
      req.files[i].path.replace(/.jpg|.png|.jpeg/g, function (x) {
        return "home" + x;
      })
    );
   

  };

  
  if (req.files.length>0)
  {    sharp(req.files[0].path)
       .resize({height:110 })
      .toFile(
        './uploads/chaticons/'+ id +'.jpg'
      );}
  




  let images=""
  let image = imagepaths.join(',');
 image=image.replaceAll("/uploads/",'/');
  if (image=="") {images=oldphotos}
  else if (oldphotos=="") {images=image}
  else {images=oldphotos.concat(",",image)};

  let ProfileColors;
  if (ProfileColorsnew=="") {ProfileColors=oldColors}
else if (oldColors=="") {ProfileColors=ProfileColorsnew}
else {ProfileColors=oldColors.concat(",",ProfileColorsnew)};


  db.query(
      "UPDATE teachers SET image=?, ProfileColors=?, Τροποποίηση=? WHERE id=?",
  [images,ProfileColors,Τροποποίηση,id],
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("Values inserted");
    }
  }
);

if (photosToDelete.length>0)
{for (i=0; i<photosToDelete.length; i++)
{ const foto=photosToDelete[i];
 
  fs.unlink(foto,
  err=>{
    if (err)
    { console.log(err);}
    else {
      console.log(foto, "deleted")
    }})


    fs.unlink(foto.replace(/.jpg|.png|.jpeg/g, function (x) {
      return "card" + x;
    }),
  err=>{
    if (err)
    { console.log(err);}
    else {
      console.log(foto, "deleted")
    }})

    fs.unlink(foto.replace(/.jpg|.png|.jpeg/g, function (x) {
      return "home" + x;
    }),
  err=>{
    if (err)
    { console.log(err);}
    else {
      console.log(foto, "deleted")
    }})
  

    
    fs.unlink(foto.replace(/.jpg|.png|.jpeg/g, function (x) {
      return "thumbnail" + x;
    }),
  err=>{
    if (err)
    { console.log(err);}
    else {
      console.log(foto, "deleted")
    }})}}});




  router.put("/changephotosorder/:id",auth,
async (req, res) => {
  const id=req.params.id;
  const images= req.body.images;
  const ProfileColors=req.body.ProfileColors;
  const Τροποποίηση =  Date.now();


  db.query(
      "UPDATE teachers SET image=?, ProfileColors=?, Τροποποίηση=? WHERE id=? AND Email=?",
  [images,ProfileColors,Τροποποίηση,id,req.decoded.email],
  (err, result) => {
      console.log(req.body);
    if (err) {
      console.log(err);
    } else {
      res.send("Values inserted");
    }
  }
);})



router.get("/changepass/:id",
    async (req, res) => {
      const id=req.params.id;
      const password=req.query.oldPass;


      db.query("SELECT Κωδικός FROM teachers WHERE id=?",
      [id] ,(err,result)=>{
        if (err) {
            console.log(err)    }
            else { 
                if (result.length>0) {
                  bcrypt.compare(password,result[0].Κωδικός, (error,response)=>
                  {
                    if (response) {
                    res.send(true);
                  }
                  else
                  {
                    res.send(false);
                  } })
                  } 

            }}
        )   
    });
    
    router.put("/newpass/:id",auth,
    async (req, res) => {
      const id=req.params.id;
      const password= req.body.newPass;
      const Κωδικός = await bcrypt.hash(password,parseInt(process.env.BCRYPT_SALTROUNDS))

      
      const test= await db.query("UPDATE teachers SET Κωδικός=? WHERE id=? AND Email=?",
        [Κωδικός,id,req.decoded.email]
      );
    
    res.send(true)
    }
    
      
      );


      router.put("/xoroi/change",auth, (req, res) => {
      const regex = /<|>/ig;
      const Χοροί = req.body.Χοροί.join(',').replace(regex, '');
      const Τροποποίηση =  Date.now();  

        db.query(
            
          "UPDATE teachers SET Χοροί=?,Τροποποίηση=? WHERE id=? AND Email=?",
          [Χοροί,Τροποποίηση,req.decoded.id,req.decoded.email],
          (err, result) => {
          
            if (err) {
              console.log(err);
            } else {
              res.send("Values inserted");
            }
          }
        );
        
      
      
      
      
      });

      router.put("/tel/change",auth, (req, res) => {
        const regex = /<|>/ig;
        const Τηλέφωνο = req.body.Τηλέφωνο.replace(regex, '');
        const Τροποποίηση =  Date.now();
          
          db.query(
              
            "UPDATE teachers SET Τηλέφωνο=?,Τροποποίηση=? WHERE id=? AND Email=?",
            [Τηλέφωνο,Τροποποίηση,req.decoded.id,req.decoded.email],
            (err, result) => {
            
              if (err) {
                console.log(err);
              } else {
                res.send("Values inserted");
              }
            }
          );
          
        
        
        
        
        });

      router.put("/insta/change",auth, (req, res) => {
          const regex = /<|>/ig;  
          const Instagram = req.body.Instagram.replace(regex, '');
          const Τροποποίηση =  Date.now();
            
            db.query(
                
              "UPDATE teachers SET Instagram=?,Τροποποίηση=? WHERE id=? AND Email=?",
              [Instagram,Τροποποίηση,req.decoded.id,req.decoded.email],
              (err, result) => {
              
                if (err) {
                  console.log(err);
                } else {
                  res.send("Values inserted");
                }
              }
            );
            
          
          
          
          
          });    
          
      router.put("/fb/change",auth, (req, res) => {
          const regex = /<|>/ig;    
          const Facebook = req.body.Facebook.replace(regex, '');
          const Τροποποίηση =  Date.now();
            
            db.query(
                
              "UPDATE teachers SET Facebook=?,Τροποποίηση=? WHERE id=? AND Email=?",
              [Facebook,Τροποποίηση,req.decoded.id,req.decoded.email],
              (err, result) => {
              
                if (err) {
                  console.log(err);
                } else {
                  res.send("Values inserted");
                }
              }
            );
            
          
          
          
          
          });  

      router.put("/site/change",auth, (req, res) => {
        const regex = /<|>/ig;
          const Ιστοσελίδα = req.body.site.replace(regex, '');
          const Τροποποίηση =  Date.now();
            
            db.query(
                
              "UPDATE teachers SET Ιστοσελίδα=?,Τροποποίηση=? WHERE id=? AND Email=?",
              [Ιστοσελίδα,Τροποποίηση,req.decoded.id,req.decoded.email],
              (err, result) => {
              
                if (err) {
                  console.log(err);
                } else {
                  res.send("Values inserted");
                }
              }
            );
            
          
          
          
          
          });  

      router.put("/linked/change",auth, (req, res) => {
        const regex = /<|>/ig;
          const Linkedin = req.body.Linkedin.replace(regex, '');
          const Τροποποίηση =  Date.now();
            
            db.query(
                
              "UPDATE teachers SET Linkedin=?,Τροποποίηση=? WHERE id=? AND Email=?",
              [Linkedin,Τροποποίηση,req.decoded.id,req.decoded.email],
              (err, result) => {
              
                if (err) {
                  console.log(err);
                } else {
                  res.send("Values inserted");
                }
              }
            );
            
          
          
          
          
          }); 


      router.put("/hlikia/change",auth, (req, res) => {
        const regex = /<|>/ig;
          const Ηλικία = req.body.Ηλικία.replace(regex, '');
          const Τροποποίηση =  Date.now();
            
            db.query(
                
              "UPDATE teachers SET Ηλικία=?,Τροποποίηση=? WHERE id=? AND Email=?",
              [Ηλικία,Τροποποίηση,req.decoded.id,req.decoded.email],
              (err, result) => {
              
                if (err) {
                  console.log(err);
                } else {
                  res.send("Values inserted");
                }
              }
            );
            
          
          
          
          
          });      

      router.put("/bio/change",auth, (req, res) => {
        const regex = /<|>/ig;
          const Βιογραφικό = req.body.Βιογραφικό.replace(regex, '');
          const Τροποποίηση =  Date.now();
            
            db.query(
                
              "UPDATE teachers SET Βιογραφικό=?,Τροποποίηση=? WHERE id=? AND Email=?",
              [Βιογραφικό,Τροποποίηση,req.decoded.id,req.decoded.email],
              (err, result) => {
              
                if (err) {
                  console.log(err);
                } else {
                  res.send("Values inserted");
                }
              }
            );
            
          
          
          
          
          });   
          
      router.put("/ptuxia/change",auth, (req, res) => {
        const regex = /<|>/ig;
      const Πτυχία = req.body.Πτυχία.join(',').replace(regex, '');
      const Τροποποίηση =  Date.now();
        
        db.query(
            
          "UPDATE teachers SET Πτυχία=?,Τροποποίηση=? WHERE id=? AND Email=?",
          [Πτυχία,Τροποποίηση,req.decoded.id,req.decoded.email],
          (err, result) => {
          
            if (err) {
              console.log(err);
            } else {
              res.send("Values inserted");
            }
          }
        );
        
      
      
      
      
      });
          
      router.put("/prouphresia/change",auth, (req, res) => {
        const regex = /<|>/ig;
        const Προυπηρεσία = req.body.Προυπηρεσία.replace(regex, '');
        const Τροποποίηση =  Date.now();
          
          db.query(
              
            "UPDATE teachers SET Προυπηρεσία=?,Τροποποίηση=? WHERE id=? AND Email=?",
            [Προυπηρεσία,Τροποποίηση,req.decoded.id,req.decoded.email],
            (err, result) => {
            
              if (err) {
                console.log(err);
              } else {
                res.send("Values inserted");
              }
            }
          );
          
        
        
        
        
        }); 


      router.put("/alla/change",auth, (req, res) => {
        const regex = /<|>/ig;
        const Άλλα = req.body.Άλλα.join(',').replace(regex, '');
        const Τροποποίηση =  Date.now();
          
          db.query(
              
            "UPDATE teachers SET Άλλα=?,Τροποποίηση=? WHERE id=? AND Email=?",
            [Άλλα,Τροποποίηση,req.decoded.id,req.decoded.email],
            (err, result) => {
            
              if (err) {
                console.log(err);
              } else {
                res.send("Values inserted");
              }
            }
          );
          
        
        
        
        
        }); 

      router.put("/perioxes/change",auth, (req, res) => {
        const regex = /<|>/ig;
        const Πόλη = req.body.Πόλη.replace(regex, '');
        const Περιοχές = req.body.Περιοχές.join(',').replace(regex, '');
        const Τροποποίηση =  Date.now();
          
          db.query(
              
            "UPDATE teachers SET Πόλη=?, Περιοχές=?,Τροποποίηση=? WHERE id=? AND Email=?",
            [Πόλη,Περιοχές,Τροποποίηση,req.decoded.id,req.decoded.email],
            (err, result) => {
            
              if (err) {
                console.log(err);
              } else {
                res.send("Values inserted");
              }
            }
          );
          
        
        
        
        
        });    

      router.put("/videos/change",auth, (req, res) => {
        const regex = /<|>/ig;
          const videos = req.body.videos.replace(regex, '');
          const Τροποποίηση =  Date.now();
            
            db.query(
                
              "UPDATE teachers SET videos=?,Τροποποίηση=? WHERE id=? AND Email=?",
              [videos,Τροποποίηση,req.decoded.id,req.decoded.email],
              (err, result) => {
              
                if (err) {
                  console.log(err);
                } else {
                  res.send("Values inserted");
                }
              }
            );
            
          
          
          
          
          });   
        
        router.post("/addphoto/new",upload.single('schoolImage') ,
        async (req, res) => {
        
          const Δημιουργία = Date.now();
        const Description =req.body.Description;
            const color =req.body.color;
            const newPhoto= process.env.THIS_DOMAIN+req.file.path;
          /*   const profilePic= req.body.profilePic; */
        
              let image=newPhoto.replaceAll("/uploads/",'/');
             
             
              
              
                sharp(req.file.path)
                .resize({ width: 260,
                height:370 })
                .toFile(
                  req.file.path.replace(/.jpg|.png|.jpeg/g, function (x) {
                    return "card" + x;
                  })
                );
                sharp(req.file.path)
                .resize({width: 150, height:150 })
                .toFile(
                  req.file.path.replace(/.jpg|.png|.jpeg/g, function (x) {
                    return "thumbnail" + x;
                  })
                );
          
                sharp(req.file.path)
                .resize({width: 290, height:290 })
                .toFile(
                  req.file.path.replace(/.jpg|.png|.jpeg/g, function (x) {
                    return "home" + x;
                  })
                );
               
         
        
          
        
                db.query(
                  "INSERT INTO photos (image,iduser,Δημιουργία,Description,color) VALUES  (?,?,?,?,?)",
                  [image,req.decoded.id,Δημιουργία,Description,color],
              (err, result) => {
                if (err) {
                  console.log(err);
                } else {
            
                 res.send(image)
                }
              }
            );
          
        
        
        
          
        
        });
        
        router.put("/contactpic/change",auth, (req, res) => {
          
            const {contactpic} = req.body;
            const Τροποποίηση =  Date.now();
              
              db.query(
                  
                "UPDATE teachers SET contactpic=?,Τροποποίηση=? WHERE id=? AND Email=?",
                [contactpic,Τροποποίηση,req.decoded.id,req.decoded.email],
                (err, result) => {
                
                  if (err) {
                    console.log(err);
                  } else {
                    res.send("Values inserted");
                  }
                }
              );
              
            
            
            
            
            });      
  
        router.put("/biopic/change",auth, (req, res) => {
          
            const {biopic} = req.body;
            const Τροποποίηση =  Date.now();
              
              db.query(
                  
                "UPDATE teachers SET biopic=?,Τροποποίηση=? WHERE id=? AND Email=?",
                [biopic,Τροποποίηση,req.decoded.id,req.decoded.email],
                (err, result) => {
                
                  if (err) {
                    console.log(err);
                  } else {
                    res.send("Values inserted");
                  }
                }
              );
              
            
            
            
            
            });


        router.put("/profilepic/change",auth, (req, res) => {
          
            const {profilepic} = req.body;
            const Τροποποίηση =  Date.now();
              
              db.query(
                  
                "UPDATE teachers SET profilepic=?,Τροποποίηση=? WHERE id=? AND Email=?",
                [profilepic,Τροποποίηση,req.decoded.id,req.decoded.email],
                (err, result) => {
                
                  if (err) {
                    console.log(err);
                  } else {
                    res.send("Values inserted");
                  }
                }
              );
              
            
            
            
            
            });
  

        router.delete("/deletephoto/:idphotos", auth, async (req, res) => {
          const idphotos = req.params.idphotos;
          let oldPhoto = req.body.oldPhoto;

          if (oldPhoto && oldPhoto != "") {
            oldPhoto = oldPhoto.replaceAll(
              process.env.THIS_DOMAIN1,
              "/var/www/vhosts/dancelink.online/DanceLinkBackend/uploads"
            );
            fs.unlink(oldPhoto, (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log(oldPhoto, "deleted");
              }
            });

            fs.unlink(
              oldPhoto.replace(/.jpg|.png|.jpeg/g, function (x) {
                return "thumbnail" + x;
              }),
              (err) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(oldPhoto, "deleted");
                }
              }
            );

            fs.unlink(
              oldPhoto.replace(/.jpg|.png|.jpeg/g, function (x) {
                return "card" + x;
              }),
              (err) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(oldPhoto, "deleted");
                }
              }
            );

            fs.unlink(
              oldPhoto.replace(/.jpg|.png|.jpeg/g, function (x) {
                return "home" + x;
              }),
              (err) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(oldPhoto, "deleted");
                }
              }
            );
          }

          db.query(
            "DELETE FROM photos WHERE idphotos=? AND iduser=?",
            [idphotos, req.decoded.id],
            (err, result) => {
              console.log(req.body);
              if (err) {
                console.log(err);
              } else {
                res.send("Values inserted");
              }
            }
          );
        });

        router.post("/testimonial/new",auth, async (req, res) => {
         

          const regex = /<|>/ig;
            const text = req.body.text.replace(regex, '');
            const fromID = req.body.fromID.replace(regex, '');
            const fromType = req.body.fromType.replace(regex, '');
            const fromΌνομα = req.body.fromΌνομα.replace(regex, '');
            const toID = req.body.toID.replace(regex, '');
            const Δημιουργία =  Date.now();





            
            
     
            db.query(
              "INSERT INTO testimonials (text,fromID,fromType,fromΌνομα,toID,Δημιουργία) VALUES  (?,?,?,?,?,?)",
          [text,req.decoded.id,fromType,fromΌνομα,toID,Δημιουργία],
                (err, result2) => {
                
                  if (err) {
                    console.log(err);
                    res.send(err);
                  } else {


                    db.query(
                      `SELECT * FROM teachers WHERE id=? `,
                    [toID],
                    (err, result) => {
                        
                      if (err) {
                        console.log(err);
                      } else {
                
                  
                
                         if (result.length==1)
                
                { let sendtoemail=result[0].Email;             
                  transport.sendMail({
                  from: `"DanceLink" ${process.env.USE_MAIL}`,
                  to: `"DanceLink" ${process.env.USE_MAIL}`,
                  bcc : sendtoemail,
                  subject: `Έχετε νέα σύσταση από το χρήστη ${fromΌνομα} ` ,
                  html: `
                  <html>
                  <head>
                <title>χετε νέα σύσταση από το χρήστη ${fromΌνομα}</title>
                </head>
                  <body>
                  <img  src="https://www.dancelink.gr/photos/profilephoto.png"  
                  alt="dancelink logo"
                  style="width: 240px;
                  height: 240px;
                  object-fit: cover;
                  object-position: center;"
                  />
                      <h3>Nέα σύσταση από το χρήστη ${fromΌνομα}</h3>
                      <div>
                      Έχετε νέα σύσταση από το χρήστη ${fromΌνομα}. Για να εμφανίζεται στο προφίλ σας πρέπει να την αποδεχτείτε.
                      <div>-Κάντε είσοδο με τα στοιχεία σας στο <a href="https://www.dancelink.gr/">dancelink.gr<a/> και</div>
                      <div>-Μπείτε στο προφίλ σας και πατήστε το εικονίδιο της επεξεργασίας κάτω δεξιά.</div>
                      <div>-Πατήστε στο μενου συστάσεις για να αποδεχτείτε ή να απορρίψετε τη σύσταση.</div>
                      </div>
                
                      
                      </body></html>`,
                  text: `Nέα σύσταση από το χρήστη ${fromΌνομα}.
                  Μπείτε στο προφίλ σας και πατήστε το εικονίδιο της επεξεργασίας κάτω δεξιά και 
                  πατήστε στο μενου συστάσεις για να αποδεχτείτε ή να απορρίψετε τη σύσταση`,
                }).then(()=>res.send("sentemails")).catch(err1 => {console.log(err1);
        
                });    
                }
                
                
                
                
                
                else 
                
                        
                       { res.send("προβλημα με το email");} 
                      }
                    }
                    
                  );

                    
                  }
                }
              );
              
            
            
            
            
            });
    
            
        router.get("/testimonials/:id", (req, res) => {
          db.query("SELECT * FROM testimonials WHERE toID=?" ,
          [req.params.id],
          (err,result)=>{
          if (err) {
              console.log(err)    }
              else { 
                  res.send(result);
                  console.log("sentresults")
              }}
          )
        })
     
        router.put("/testimonial/active/:idtestimonials",auth, (req, res) => {
         

          const regex = /<|>/ig;
            const active = req.body.active.replace(regex, '');
            const Τροποποίηση =  Date.now();
     
            db.query(
              "UPDATE testimonials SET active=?,Τροποποίηση=? WHERE idtestimonials=? AND toID=?",
          [active,Τροποποίηση,req.params.idtestimonials,req.decoded.id],
                (err, result) => {
                
                  if (err) {
                    console.log(err);
                  } else {
                    res.send("Values inserted");
                  }
                }
              );
              
                  
                
                
                
                
                });  
      
        router.put("/testimonial/edit/:idtestimonials",auth, (req, res) => {
         


          const regex = /<|>/ig;
            const text = req.body.text.replace(regex, '');
            const fromID = req.body.fromID.replace(regex, '');
            const fromType = req.body.fromType.replace(regex, '');
            const fromΌνομα = req.body.fromΌνομα.replace(regex, '');
            const toID = req.body.toID.replace(regex, '');
            const Δημιουργία =  Date.now();
     
            db.query(
              "UPDATE testimonials SET text=?,fromType=?,fromΌνομα=?,toID=?,Τροποποίηση=? WHERE idtestimonials=? AND fromID=?",
          [text,fromType,fromΌνομα,toID,Δημιουργία,req.params.idtestimonials,req.decoded.id],
                (err, result) => {
                
                  if (err) {
                    console.log(err);
                  } else {
                    res.send("Values inserted");
                  }
                }
              );
              
                  
                
                
                
                
                });   

module.exports = router;