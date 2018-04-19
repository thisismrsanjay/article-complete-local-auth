const express= require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// bring  User models
let User = require('../models/user');


//Register Form litrelly i want /users/register

router.get('/register',function(req,res){
    res.render('register')
})
 
router.get('/login',function(req,res){
    res.render('login');
})
router.post('/register',function(req,res){
    let errors = [] ;
    if (req.body.password != req.body.password2) {
        errors.push({ text: 'Password do not match' });
    }
    if (req.body.password.length < 4) {
        errors.push({ text: 'Password must be atleast 4 characters' });
    }
    if (errors.length > 0) {
        res.render('register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            username:req.body.username,
            password: req.body.password,
            password2: req.body.password2
        })
    } else {
        User.findOne({ email: req.body.email },(err,result)=>{
            //result will return null
            if(!result){
                //i  din't find existing email hash password and set it
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    username: req.body.username
                })
                //bycrypt
                bcrypt.genSalt(10,function(err,salt){
                    bcrypt.hash(newUser.password,salt,function(err,hash){
                        if(err){
                            console.log(err);
                        }
                        newUser.password= hash;
                        newUser.save(function(err){
                            if(err){
                                console.log(err);
                            }else{
                                req.flash('success_msg','dope');
                                res.redirect('/users/login');
                            }
                        });
                    });
                })
            }else{
                //i got a user
                res.send('users/login');
            }
        })
    }
})

//login process 
router.post('/login',function(req,res,next){
    passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash:true
    })(req,res,next)
})

router.get('/logout',function(req,res){
    req.logout();
   
    res.redirect('/users/login');
})


module.exports = router;