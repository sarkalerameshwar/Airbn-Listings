const Listing = require("./models/listing.model");
const Review = require("./models/review.model");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) =>{
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) =>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  if (!req.user) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  if(!listing.owner._id.equals(req.user._id)){
    req.flash("error", "you do not have permission to do that");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.isReviewAuthor = async (req, res, next) =>{
  let {id,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "review not found");
    return res.redirect("/listings");
  }
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error", "you do not have permission to do that");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
