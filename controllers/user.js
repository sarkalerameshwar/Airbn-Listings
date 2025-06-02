const User = require("../models/user.model");


module.exports.getSignupPage = (req, res) => {
  res.render("users/signup.ejs");
}

module.exports.signupUser = async (req, res, next) =>{
    const {username, email, password} = req.body;
    if (!username) {
        req.flash("error", "Username is required");
        return res.status(400).render("users/signup.ejs");
    }
    try {
        const newUser = new User({username, email});
        const registerUser = await User.register(newUser, password);
        return req.login(registerUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to the site!");
            return res.redirect("/listings");
        });
    } catch (error) {
        req.flash("error", error.message);
        return res.status(400).render("users/signup.ejs");
    }
}

module.exports.getLoginPage = (req, res) => {
  res.render("users/Login.ejs");
}

module.exports.postLogin = 
  async (req, res) => {
    req.flash("success", "Welcome back to WonderLust!!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }

module.exports.LogoutUser =  (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully!, Good Bye!!!");
    res.redirect("/listings");
  });
}