const axios = require('axios');
const Listing = require("../models/listing.model");

module.exports.index = async (req, res) => {
  try {
    const listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
  } catch (error) {
    console.error("Error fetching listings:", JSON.stringify(error, null, 2));
    req.flash("error", "Failed to fetch listings.");
    res.redirect("/");
  }
};

module.exports.newListingForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id).populate({
      path: "reviews",
      populate: { path: "author" },
    });

    if (!listing) {
      req.flash("error", "Listing you requested does not exist");
      return res.redirect("/listings");
    }

    // Geocode the location using MapQuest API
    const mapQuestKey = process.env.MAPQUEST_API_KEY;
    let coordinates = { lat: 37.7749, lng: -122.4194 }; // default fallback

    if (listing.location && mapQuestKey) {
      const geoResponse = await axios.get(`http://www.mapquestapi.com/geocoding/v1/address`, {
        params: {
          key: mapQuestKey,
          location: listing.location
        }
      });
      const locationData = geoResponse.data;
      if (
        locationData &&
        locationData.results &&
        locationData.results[0] &&
        locationData.results[0].locations &&
        locationData.results[0].locations[0] &&
        locationData.results[0].locations[0].latLng
      ) {
        coordinates = locationData.results[0].locations[0].latLng;
      }
    }

    res.render("listings/show.ejs", { listing, coordinates });
  } catch (error) {
    console.error("Error fetching listing:", JSON.stringify(error, null, 2));
    req.flash("error", "Could not load the listing.");
    res.redirect("/listings");
  }
};

module.exports.createListing = async (req, res) => {
  const { title, description, price, location, country } = req.body;

  const newListing = new Listing({
    title,
    description,
    image: req.file ? req.file.path : undefined,
    price,
    location,
    country,
  });

  try {
    newListing.owner = req.user._id;
    await newListing.save();

    req.flash("success", "New listing is added");
    res.redirect("/listings");
  } catch (error) {
    console.error("Error creating listing:", JSON.stringify(error, null, 2));

    if (error.name === "ValidationError") {
      res.status(400).render("listings/new.ejs", {
        listing: req.body,
        errors: error.errors,
      });
    } else {
      req.flash("error", error.message || "Internal Server Error");
      res.redirect("/listings/new");
    }
  }
};

module.exports.getEditForm = async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  } catch (error) {
    console.error("Error loading edit form:", JSON.stringify(error, null, 2));
    req.flash("error", "Error loading edit form");
    res.redirect("/listings");
  }
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location, country } = req.body;

  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found for update.");
      return res.redirect("/listings");
    }

    listing.title = title;
    listing.description = description;
    listing.price = price;
    listing.location = location;
    listing.country = country;

    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await listing.save();

    req.flash("success", "Listing Edited Successfully.");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.error("Error updating listing:", JSON.stringify(error, null, 2));
    if (error.name === "ValidationError") {
      res.status(400).render("listings/edit.ejs", {
        listing: { ...req.body, _id: id },
        errors: error.errors,
      });
    } else {
      req.flash("error", "Something went wrong while updating.");
      res.redirect(`/listings/${id}/edit`);
    }
  }
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Listing.findByIdAndDelete(id);

    if (!deleted) {
      req.flash("error", "Listing not found for deletion.");
      return res.redirect("/listings");
    }

    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
  } catch (error) {
    console.error("Error deleting listing:", JSON.stringify(error, null, 2));
    req.flash("error", "Failed to delete listing.");
    res.redirect("/listings");
  }
};
