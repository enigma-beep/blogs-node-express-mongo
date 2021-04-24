// const http = require('http')
// const fs = require('fs')

// const server = http.createServer((req, res) => {
//   res.writeHead(200, { 'content-type': 'text/html' })
//   fs.createReadStream('index.html').pipe(res)
// })

// server.listen(process.env.PORT || 3009)
const port = process.env.PORT || 3012

var bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    express             = require("express"),
    app                 = express(),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer"),
    flash               = require("connect-flash"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    Blog                = require("./models/blog"),
    Comment             = require("./models/comment"),
    User                = require("./models/user");

//Require Route Root
var authRoutes = require("./routes/auth");
var blogRoutes = require("./routes/blogs");
var commentRoutes = require("./routes/comments");
    
//App Config
// mongoose.connect("mongodb://nibiaa-admin:Nibiaa%401234@cluster0-shard-00-00.odtgd.mongodb.net:27017,cluster0-shard-00-01.odtgd.mongodb.net:27017,cluster0-shard-00-02.odtgd.mongodb.net:27017/blog?ssl=true&replicaSet=atlas-11hjem-shard-0&authSource=admin&retryWrites=true&w=majority", {useMongoClient: true});
mongoose.connect("mongodb://nibiaa-admin:Nibiaa%401234@cluster0-shard-00-00.odtgd.mongodb.net:27017,cluster0-shard-00-01.odtgd.mongodb.net:27017,cluster0-shard-00-02.odtgd.mongodb.net:27017/blog?ssl=true&replicaSet=atlas-11hjem-shard-0&authSource=admin&retryWrites=true&w=majority", {useMongoClient: true});

mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(expressSanitizer()); //this code MUST BE BEFORE bodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

//Passport Config
app.use(require("express-session")({
    secret: "This blog is made by most beautiful puppy",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//This is middleware
//pass req.user to every single template EJS
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); //without next(), it stops and doesn't move to next middleware/route handler
});

//REQUIRE ROUTES
app.use(authRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);



// Restful Route
app.get("/", function(req, res){
    res.redirect("blogs");
    // res.render('home');
});

//In cloud9
// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log("SERVER IS STARTED");
// })
//Otherwise run locally
app.listen(port, function(){
    console.log("SERVER IS STARTED at 3012");
})
