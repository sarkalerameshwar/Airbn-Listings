const express = require("express");
const router = express.Router();
const { saveRedirectUrl } = require("../middleware.js");
const passport = require("passport");

const userController = require("../controllers/user.js");

router
  .route("/signup")
  .get(userController.getSignupPage)
  .post(userController.signupUser);

router
  .route("/login")
  .get( userController.getLoginPage)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.postLogin
  );

router.get("/logout", userController.LogoutUser);

module.exports = router;
