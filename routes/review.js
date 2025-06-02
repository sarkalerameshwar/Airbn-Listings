const express = require('express')
const router = express.Router({mergeParams:true})
const Review = require("../models/review.model.js");
const Listing = require("../models/listing.model.js");
const { isLoggedIn,isReviewAuthor } = require('../middleware.js');

const reviewController = require("../controllers/reviews.js");


router.post("/",isLoggedIn, reviewController.creatingReview);

router.delete("/:reviewId",isReviewAuthor, reviewController.deleteReview);

module.exports = router;
