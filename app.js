//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _= require('lodash');
const mongoose= require("mongoose");
const dotenv = require("dotenv");

const app = express();


let port = process.env.PORT;



mongoose.connect(process.env.URL,{ useNewUrlParser: true }).then(()=>{


// if(port==null||port==""){
//     port=3000;
// }
app.listen(port||3000, function () {
    console.log('sarver is started');
});
}).catch((err)=>console.log(err));


 
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled

const postschema= new mongoose.Schema({title:String,body:String,Imgtext:String,Head2:String,Imgtext2:String,body2:String, updated: { type: Date, default: Date.now },});

const Post=mongoose.model('post' ,postschema);

// const postone=new Post({title:"hiii",body:"this is the test post",Imgtext:"https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg"})
// postone.save();
const homeStartingContent = "HEY Buddy ,Welcome to my Page here you got all information About Ratlam , So Keep Visiting and Keep Reading ThankYou ❤️ ";
const aboutContent = "https://khanaffi.github.io/mysite/"
const contactContent = "Dailyratlam0@gmail.com"
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const thedata=[]


app.get("/", async (req,res)=>{
//  let datap=[title="hii",body="hlw"];

// function(err,posts){
  const postdata= await Post.find({}).sort({updated:-1});
  res.render("home",{inner:homeStartingContent,newpost:postdata});

  });
//   try {
    
// } catch (error) {
//   res.status(404).json({ message: error.message });
//   res.render("home",{inner:homeStartingContent,newpost:{}});

// });

  
 

app.get("/about",function(req,res){
  // res.render("about",{innerab:aboutContent});
  // res.sendFile(__dirname + '/about.html');
  res.redirect("https://khanaffi.github.io/mysite/")
})
app.get("/compose",function(req,res){
  res.render("compose");
})
app.post("/compose",function(req,res){
  const post = new Post ({
    title: req.body.usertext,
    body: req.body.postbody,
    Imgtext: req.body.imgtext,
    Head2:req.body.usertext2,
    Imgtext2: req.body.imgtext2,
    body2:req.body.postbody2
  });
  post.save(function(err){

    if (!err){
 
      res.redirect("/");
 
    }
  });
})
app.get("/posts/:testings",function(req,res){
  const reqdata =req.params.testings;


  Post.findOne({"title":reqdata}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.body,
      Imgtext: post.Imgtext,
      Head2:post.Head2,
      Imgtext2:post.Imgtext2,
      body2:post.body2
    });
  });

})

app.get("/contact",function(req,res){
  res.render("contact",{innerct:contactContent});
})
app.get("/blog",function(req,res){
  res.render("blog",{innerct:contactContent});
})













