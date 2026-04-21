const User = require("../models/user.js");

module.exports.createUserForm = (req,res) => {
    res.render("users/singup.ejs")
}

module.exports.createNewUser=async(req,res)=>{
    try{
        let {username, email, password} = req.body;
        let newUser = new User({email, username})
        let registedUser = await User.register(newUser, password);
        console.log(registedUser);
        req.login(registedUser,(err) => {
            if(err){
                return next(err)
            }else{
                req.flash("success","user was registered");
                res.redirect("/listings")
            }
        })
       
    }catch(err){
        req.flash("error",err.message)
        res.redirect("/user/singup")
    }
   
}

module.exports.userloginForm = (req,res)=>{
    res.render("users/login.ejs")
}
module.exports.authenticateUser=async(req,res)=>{
    let {username,password} = req.body
    console.dir(req.isAuthenticated)
    let redirectUrl = res.locals.redirectUrl || "/";
    res.redirect(redirectUrl);
    console.log(res.locals.redirectUrl);
}

module.exports.logoutUser = (req,res)=>{
    req.logout((err) =>{
        if(err){
            return next(err)
        }
        req.flash("success", "you are logged out now")
        res.redirect("/")
    })
}