require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const mongoStore = require("connect-mongo");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const Review = require("./models/review.model.js");
const listing = require("./routes/listings.js");
const review = require("./routes/review.js");
const user = require("./routes/users.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.model.js");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

const URL = process.env.DB_URL;

const store = mongoStore.create({
  mongoUrl: URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

const sessionOptions = {
  store,
  secret:  process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

store.on("error", (err) => {
  console.log(err);
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listing);
app.use("/listings/:id/reviews", review);
app.use("/", user);

mongoose.connect(URL)
.then(() => console.log("✅ MongoDB connection successful"))
.catch(err => console.error("❌ MongoDB connection error:", err));


// app.get("/demouser", async (req, res) =>{
//   let fakeuser = new User({
//     email : "ram@123",
//     username : "ram"
//   });
//   let savedUser = await User.register(fakeuser, "pass");
//   res.send(savedUser);
// })

// app.all("*", (req, res, next) =>{
//   next(new expressError(404, "Page not found"));
// })

// app.use((err, req, res, next) =>{
//   let {status, message} = err;
//   res.status(status).send(message);
// })

// app.get("/listing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "Sample Listing",
//     description: "This is a sample listing",
//     // image : " ",
//     price: 1000,
//     location: "Atola, Latur",
//     country: "india",
//   });

//   try {
//     const savedListing = await sampleListing.save();
//     console.log(savedListing);
//     res.send("Data saved successfully");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error saving data");
//   }
// });

app.listen(8080, () => {
  console.log(`server is serving on port ${8080}`);
});
