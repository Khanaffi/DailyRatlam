//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _= require('lodash');
const mongoose= require("mongoose");

mongoose.connect("mongodb+srv://aftabkhan0317:3wePa6drkULxvNIt@cluster0.scxjv7h.mongodb.net/blogDB ", { useNewUrlParser: true })


 
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled

const postschema= new mongoose.Schema({title:String,body:String});

const Post=mongoose.model('post' ,postschema);

const postone=new Post({titile:"hiii",body:"this is the test post"})
// postone.save();
const homeStartingContent = "hii am affi , this is my personal blog page, keeep reading thankyou";
const aboutContent = "https://khanaffi.github.io/mysite/"
const contactContent = "aftabkhan0317@gmail.com"

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// const thedata=[]


app.get("/",function(req,res){

 
  Post.find( {},function(err,posts){
    
    res.render("home",{inner:homeStartingContent,newpost:posts});
  })
  
 
  
  
})

app.get("/about",function(req,res){
  res.render("about",{innerab:aboutContent});
})
app.get("/compose",function(req,res){
  res.render("compose");
})
app.post("/compose",function(req,res){
  const post = new Post ({
    title: req.body.usertext,
    body: req.body.postbody
  });
  post.save(function(err){

    if (!err){
 
      res.redirect("/");
 
    }
 
  });
})
app.get("/posts/:testings",function(req,res){
  const reqdata =req.params.testings;


  Post.findOne({title:reqdata}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.body
    });
  });

})

app.get("/contact",function(req,res){
  res.render("contact",{innerct:contactContent});
})












let port = process.env.PORT;
// if(port==null||port==""){
//     port=3000;
// }
app.listen(port||3000, function () {
    console.log('started');
});