var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp-camp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Granite Hill",
//         image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=80",
//         description: "This campsite is on a huge granite hill.  No bathrooms or running water.  Beautiful views."
//     }, function(err, campground) {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("new campground");
//             console.log(campground);
//         }
//     }
// );


// ROUTES


app.get("/", function(req, res) {
    res.render("landing");
})

// INDEX - show all campgrounds
app.get("/campgrounds", function(req, res) {
    //Get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("index", { campgrounds: allCampgrounds });
        }
    })
    
})

// CREATE - add new campground to db
app.post("/campgrounds", function(req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    //create new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            //redirect to campgrounds page
            res.redirect("/campgrounds");
        };
    });
})

// NEW - show form to create new campground
app.get("/campgrounds/new", function (req, res) {
    res.render("new");
})

// SHOW - show info about one campground
app.get("/campgrounds/:id", function(req, res) {
    //find campground with provided id
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
    
})

app.listen(3000, process.env.IP);
