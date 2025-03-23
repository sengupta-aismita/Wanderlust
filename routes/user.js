const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userControllers = require("../controllers/users.js");


router.route("/signup")
.get(userControllers.renderSignupForm )
.post(
  wrapAsync(userControllers.signUp)
);

router.route("/login")
.get(userControllers.renderLoginForm )
.post(
  
  saveRedirectUrl,
  passport.authenticate(
    "local",
    { failureRedirect: "/login" ,
    failureFlash: true }
  ),
  userControllers.login
);


router.get("/logout",userControllers.logout )

module.exports = router;
