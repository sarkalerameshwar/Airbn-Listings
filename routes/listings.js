const mongoose = require("mongoose");
const express = require("express");
const Review = require("../models/review.model.js");
const Listing = require("../models/listing.model.js");
const router = express.Router();
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingsController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage });

router.route("/")
.get( listingsController.index)
.post(isLoggedIn,upload.single('image'), listingsController.createListing);
// .post(upload.single('image'),(req, res)=>{
//     res.send(req.file);
// })


router.get("/new", isLoggedIn, listingsController.newListingForm);

router.route("/:id")
.get(isLoggedIn, listingsController.showListing)
.delete(isLoggedIn,isOwner, listingsController.deleteListing);

router.route("/:id/edit")
.get(isLoggedIn,isOwner,listingsController.getEditForm)
.post(isLoggedIn,isOwner, upload.single('image'), listingsController.editListing);

module.exports = router;
