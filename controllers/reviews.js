const Listing = require("../models/listing.model");
const Review = require("../models/review.model");

module.exports.creatingReview =  async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Incoming review data:", req.body.review);
    const listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    if (!listing) return res.status(404).send("Listing not found");


    listing.reviews.push(newReview);
    await newReview.save(); 
    await listing.save();

    req.flash("success", "New review is created")
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error("Error saving review:", err);
    res.status(500).send("Failed to save review");
  }
}

module.exports.deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }, { new: true });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully")
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting review");
  }
}