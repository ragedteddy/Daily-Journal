
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const homeStartingContent = "fkljf klewfjef w fw ofw uofewoew we uw uow uoo weu we u u ewur uowrqoqriqipaoeofeo.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("secretURL");

const postsSchema = {
    index: Number,
    title: String,
    body: String
};

const Post = mongoose.model("Post", postsSchema);

app.get("/", function(req,res){
    Post.find({}, function(err, foundItems) {
        res.render("home", {startingContent: homeStartingContent, postItems: foundItems});
    });
});

app.get("/about", function(req,res){
    res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req,res){
    res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req,res){
    res.render("compose");
});

app.post("/compose", function(req,res){
    Post.count({}, function(err, postCount){
        const post = new Post({
            index: postCount+1,
            title: req.body.postTitle,
            body: req.body.postBody
        });
        post.save();
    });
    res.redirect("/");
});

app.get("/post/:postId", function(req,res){
    Post.count({}, function(err, postCount){
        if(req.params.postId > postCount){
            res.redirect("/");
        }else{
            Post.findOne({index: req.params.postId}, function(err, foundItems){
                res.render("post", {postTitle: foundItems.title, postBody:foundItems.body});
            });
        }
    });
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
