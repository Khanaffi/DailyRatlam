//jshint esversion:6
require('dotenv').config();
const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require('axios');

const app = express();


let port = process.env.PORT;
const apiKey = process.env.API;

const thedata = [];




mongoose.connect(process.env.URL, { useNewUrlParser: true }).then(() => {

  app.listen(port || 5000, function () {
    console.log('sarver is started');
  });
}).catch((err) => console.log(err));



// use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled

const postschema = new mongoose.Schema({ title: String, body: String, Imgtext: String, Head2: String, Imgtext2: String, body2: String, updated: { type: Date, default: Date.now }, });

const Post = mongoose.model('post', postschema);

// const postone=new Post({title:"hiii",body:"this is the test post",Imgtext:"https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg"})
// postone.save();
const homeStartingContent = "HEY Buddy ,Welcome to my Page here you got all information About Ratlam , So Keep Visiting and Keep Reading ThankYou ❤️ ";
const aboutContent = "https://khanaffi.github.io/mysite/"
const contactContent = "Dailyratlam0@gmail.com"
const welcom = [title = "hello "]
const lat = 23.3315; // You can change the city or make it dynamic based on user input
const lon =75.0367;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


async function weather() {

  try {
    const response = await axios.get(url);
    const weatherData = response.data;
    const data = {
      city: weatherData.name,
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon

    };
    return data;
  }catch(error){console.log(error);}
}



async function renderdata() {
    const postdata = await Post.find({}).sort({ updated: -1 });
    if (postdata !== null) {
      if(thedata.length==0){
      postdata.forEach((d) => {
      

          thedata.push(d);
        
      });}
      return thedata

    }
  };

  async function postupdate(reqdata) {
    let posts = [];

    let foundObject = thedata.find(item => item.title === reqdata);
    console.log(foundObject);
 
    // console.log(posts);
    return foundObject

  }
  


  app.get("/", async (req, res) => {
    //  let datap=[title="hii",body="hlw"];

    const mosam= await weather();
    // function(err,posts){
    const content = await renderdata();
    // console.log(content);
    res.render("home", {
      mosam:mosam,
      titles: 'Home Page',
      description: "Ratlam all news, shops ,cafe ,Food, in this website you can find all things about Ratlam.a daily news about Ratlam ,best food shops in ratlam ,best cafe in ratlam ,best places in ratlam ,best coching centers in ratlam.  ",
      keywords: 'Daily Ratlam NEWS| Ratlam Shops,ratlam Places,ratlam Foods,ratlam Showrooms,ratlam Cafe',
      inner: homeStartingContent, newpost: content,
     
      canonicalUrl: 'https://dailyratlam.in/'
    })


  });
  //   try {

  // } catch (error) {
  //   res.status(404).json({ message: error.message });
  //   res.render("home",{inner:homeStartingContent,newpost:{}});

  // });




  app.get("/about", function (req, res) {
    // res.render("about",{innerab:aboutContent});
    // res.sendFile(__dirname + '/about.html');
    res.redirect("https://khanaffi.github.io/mysite/")
  })
  app.get("/compose", function (req, res) {
    res.render("compose", {
      titles: 'compose',
      description: "Ratlam all news, shops ,cafe ,Food, in this website you can find all things about Ratlam.a daily news about Ratlam ,best food shops in ratlam ,best cafe in ratlam ,best places in ratlam ,best coching centers in ratlam.  ",
      keywords: 'Daily Ratlam NEWS| Ratlam Shops,ratlam Places,ratlam Foods,ratlam Showrooms,ratlam Cafe',
      canonicalUrl: 'https://dailyratlam.in/compose'
    });
  })
  app.post("/compose", function (req, res) {
    const post = new Post({
      title: req.body.usertext,
      body: req.body.postbody,
      Imgtext: req.body.imgtext,
      Head2: req.body.usertext2,
      Imgtext2: req.body.imgtext2,
      body2: req.body.postbody2
    });
    thedata.push(post);
    post.save(function (err) {
      if (!err) {

        res.redirect("/");

      }
    });
  })
  app.get("/posts/:testings", async function (req, res) {
    let reqdata = req.params.testings;
    // console.log(render);
    const render = await postupdate(reqdata);
    
    // console.log(render);
    
    try{
      res.render("post", {
        titles: render.title, 
        description: render.body,
        keywords: 'Daily Ratlam NEWS||ratlami blogger Ratlam Shops,ratlam Places,ratlam Foods,ratlam Showrooms,ratlam Cafe',
        canonicalUrl: `https://dailyratlam.in/posts/${reqdata}`,
        title: render.title,
        content: render.body,
        Imgtext: render.Imgtext,
        Head2: render.Head2,
        Imgtext2: render.Imgtext2,
        body2: render.body2
      });
    }
    catch(error) {
      res.redirect("/post");
    }
  });





  app.get("/contact", function (req, res) {
    res.render("contact", {
      innerct: contactContent,
      titles: 'Contact page - daily ratlam',
      description: "Ratlam all news, shops ,cafe ,Food, in this website you can find all things about Ratlam.a daily news about Ratlam ,best food shops in ratlam ,best cafe in ratlam ,best places in ratlam ,best coching centers in ratlam.  ",
      keywords: 'Daily Ratlam NEWS||ratlami blogger | Ratlam Shops,ratlam Places,ratlam Foods,ratlam Showrooms,ratlam Cafe',
      canonicalUrl: 'https://dailyratlam.in/contact'
    });
  });
  app.get("/blog", function (req, res) {
    res.render("blog", {
      innerct: contactContent,
      titles: 'blogs page - daily ratlam',
      description: "Ratlam all news, shops ,cafe ,Food, in this website you can find all things about Ratlam.a daily news about Ratlam ,best food shops in ratlam ,best cafe in ratlam ,best places in ratlam ,best coching centers in ratlam.  ",
      keywords: 'Daily Ratlam NEWS| ratlami blogger | Ratlam Shops,ratlam Places,ratlam Foods,ratlam Showrooms,ratlam Cafe',
      canonicalUrl: 'https://dailyratlam.in/blog'
    });
  });

  app.get("/sitemap", (req, res) => {

    res.sendFile('sitemap.xml', { root: '.' });
  })












