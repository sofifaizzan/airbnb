const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportLocal = require("passport-local");

const wrapAsync = require("../utils/wrapAsync.js");
const {saveRedirectUrl} = require('../middleware.js');
const userController = require("../controllers/users.js")
//createUserForm && Save Create User
router.route("/singup")
.get(userController.createUserForm)
.post(wrapAsync(userController.createNewUser))

// loginForm
router.route("/login")
.get(userController.userloginForm)
.post(saveRedirectUrl,passport.authenticate("local", {failureRedirect: '/user/login', failureFlash: true}),wrapAsync(userController.authenticateUser))

// logout User
router.get("/logout", userController.logoutUser)

module.exports = router;