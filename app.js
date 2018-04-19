const express =require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const flash = require('connect-flash');
const session =require('express-session');
const passport = require('passport');
const config = require('./config/database');


//express-session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

app.use(flash());


//Global variables
app.use(function(req,res,next){
    res.locals.success_msg =req.flash('success_msg');
    res.locals.error_msg  =req.flash('error_msg');
    next();
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


mongoose.connect(config.database);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('database connected');
});


// bring models
let Article = require('./models/article');

//load view engine 
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));

//passport config
require('./config/passport')(passport);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use('*',function(req,res,next){
    res.locals.user = req.user || null;
    next();
})

app.get('/',function(req,res){
    Article.find({},function(err,articles){
        
        res.render('index',{
            title:'Articles',
            articles:articles
        })
    })
})

let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/users',users);
app.use('/articles',articles)

app.listen(3000);


