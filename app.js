const express = require("express");
const app = express();
const cors=require('cors');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();
const http = require('http').Server(app);

// const session=require('express-session');
const port= process.env.PORT 

//const slowDown = require("express-slow-down");

// app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

/* const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // allow 100 requests per 15 minutes, then...
  delayMs: 500 // begin adding 500ms of delay per request above 100:
  // request # 101 is delayed by  500ms
  // request # 102 is delayed by 1000ms
  // request # 103 is delayed by 1500ms
  // etc.
});



app.use(speedLimiter); */





const teachersRoutes=require('./api/routes/teachers');
const autologinRoutes=require('./api/routes/autologin');
const emailverify=require('./api/routes/emailverify');
const loginRoutes=require('./api/routes/login');

const coachesRoutes=require('./api/routes/coaches');
const courtsRoutes=require('./api/routes/courts');
const bookingsRoutes=require('./api/routes/bookings');


app.use(cors({
origin:  "*",
methods: "*",
preflightContinue: true,
credentials: true
}));

// app.use(cors());

app.use(express.json());

app.use('/uploads',express.static('uploads'));

app.use(cookieParser());

app.use(bodyParser.urlencoded({extended:true}));

app.use('/teachers',teachersRoutes);
app.use('/login',loginRoutes);
app.use('/autologin',autologinRoutes);
app.use('/emailverify',emailverify);
app.use('/coaches',coachesRoutes);
app.use('/courts',courtsRoutes);
app.use('/bookings', bookingsRoutes);






http.listen(port, () => {console.log("Server running OK")});
