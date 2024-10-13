//jshint esversion:6
require('dotenv').config();
const path = require('path');
const cron=require('node-cron');
const fetch=require('node-fetch');
const Razorpay = require('razorpay');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require('axios');
const { title } = require('process');

const app = express();
async function keepAlive() {
  try {
    const response = await fetch('http://dailyratlam.in/ping');
    if (response.ok) {
      console.log('Server is alive:', new Date());
    } else {
      console.log('Server returned an error:', response.status, new Date());
    }
  } catch (error) {
    console.error('Error making request:', error, new Date());
  }
}

// Schedule the keep-alive function to run every 14 minutes
cron.schedule('*/14 * * * *', () => {
  console.log('Running keepAlive task:', new Date());
  keepAlive();
});

// Initial call to keep the server alive immediately when the server starts
keepAlive();


let port = process.env.PORT;
const apiKey = process.env.API;

let thedata = [];




mongoose.connect(process.env.URL, { useNewUrlParser: true }).then(() => {

  app.listen(port || 5000, function () {
    console.log('sarver is started');
  });
}).catch((err) => console.log(err));



// use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled

const postschema = new mongoose.Schema({ title: String, body: String, Imgtext: String, Head2: String, keywords:String,L1:String,L2:String, Imgtext2: String, body2: String, updated: { type: Date, default: Date.now }, });

const Post = mongoose.model('post', postschema);

// const postone=new Post({title:"hiii",body:"this is the test post",Imgtext:"https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg"})
// postone.save();
const homeStartingContent = "HEY Buddy ,Welcome to my blog website here you got all information About Ratlam , So Keep Visiting and Keep Reading ThankYou ❤️ ";
const aboutContent = "https://khanaffi.github.io/mysite/"
const contactContent = "Dailyratlam0@gmail.com"

const lat = 23.3315; // You can change the city or make it dynamic based on user input
const lon =75.0367;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let urlsitemap=[]


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
  thedata=[]
    const postdata = await Post.find({}).sort({ updated: -1 });
    if (postdata !== null) {
      if(thedata.length==0){
      postdata.forEach((d) => {
          thedata.push(d);
        
      });}
// console.log(urls);
      return thedata

    }
  };

  async function postupdate(reqdata) {
    let posts = [];

    let foundObject = thedata.find(item => item.title === reqdata);
    // console.log(foundObject);
 
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
      description: " dailyratlam home page Ratlam all news, shops ,cafe ,Food, in this website you can find all things about Ratlam.a daily news about Ratlam ,best food shops in ratlam ,best cafe in ratlam ,best places in ratlam ,best coching centers in ratlam.  ",
      keywords: "dailyratlam Ratlam news | ratlam best food | ratlam best places | best shops in ratlam | gold shops in ratlam | ratlam oyo rooms | jamad patli | Dargah in ratlam | ratlam best cafe | ratlam call service |",
      inner: homeStartingContent, newpost: content,
     
      canonicalUrl: 'https://dailyratlam.in/'
    })


  });
  //   try {

  // } catch (error) {
  //   res.status(404).json({ message: error.message });
  //   res.render("home",{inner:homeStartingContent,newpost:{}});

  // });


app.get("/ping",(req,res)=>{
  res.send('pong');
});

  app.get("/about", function (req, res) {
    // res.render("about",{innerab:aboutContent});
    // res.sendFile(__dirname + '/about.html');
    res.render('about.ejs',{ titles: 'About page - daily ratlam',
      description: "Ratlam all news, shops ,cafe ,Food, in this website you can find all things about Ratlam.a daily news about Ratlam ,best food shops in ratlam ,best cafe in ratlam ,best places in ratlam ,best coching centers in ratlam.  ",
      keywords: 'Ratlam news | ratlam best food | ratlam best places | best shops in ratlam | gold shops in ratlam | ratlam oyo rooms | jamad patli | Dargah in ratlam | ratlam best cafe | ratlam call service |',
      canonicalUrl: 'https://dailyratlam.in/contact'});
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
      body2: req.body.postbody2,
      keywords:req.body.keywords,
      L1:req.body.l1,
      L2:req.body.l2
    });
    thedata.push(post);
    post.save(function (err) {
      if (!err) {
        thedata=[]

        res.redirect("/");

      }
    });
  })
  app.get("/posts/:testings", async function (req, res) {

    try{
      const content = await renderdata();

      let reqdata = req.params.testings;
      // console.log(render);
      const render = await postupdate(reqdata);
      let str=render.title;
      let arr =str.split("-").join(" ");

      res.render("post", {
        date:render.updated,
        titles: arr, 
        description: render.body,
        keywords: render.keywords,
        canonicalUrl: `https://dailyratlam.in/posts/${reqdata}`,
        title: arr,
        content: render.body,
        Imgtext: render.Imgtext,
        Head2: render.Head2,
        Imgtext2: render.Imgtext2,
        body2: render.body2,
        L1:render.L1,
        L2:render.L2
      });
    }
    catch(error) {
      res.redirect("/post");
    }
  });

  app.get("/post ",(req,res)=>{
    res.redirect("/blog");

  });




  app.get("/contact", function (req, res) {
    res.render("contact", {
      innerct: contactContent,
      titles: 'Contact page - daily ratlam',
      description: " daily Ratlam all news, shops ,cafe ,Food, in this website you can find all things about Ratlam.a daily news about Ratlam ,best food shops in ratlam ,best cafe in ratlam ,best places in ratlam ,best coching centers in ratlam.  ",
      keywords: 'Daily Ratlam NEWS||ratlami blogger | Ratlam Shops,ratlam Places,ratlam Foods,ratlam Showrooms,ratlam Cafe',
      canonicalUrl: 'https://dailyratlam.in/contact'
    });
  });
  app.get("/blog", function (req, res) {
    res.render("blog", {
      innerct: contactContent,
      titles: 'blogs page - daily ratlam',
      description: " Dailyratlam blogs | daily Ratlam all news, shops ,cafe ,Food, in this website you can find all things about Ratlam.a daily news about Ratlam ,best food shops in ratlam ,best cafe in ratlam ,best places in ratlam ,best coching centers in ratlam.  ",
      keywords: 'blogs of ratlam | ratlam web devlopment course | Mern stack in ratlam | ratlam coaching classes |Daily Ratlam NEWS| ratlami blogger | Ratlam Shops,ratlam Places,ratlam Foods,ratlam Showrooms,ratlam Cafe | ratlam blogs website',
      canonicalUrl: 'https://dailyratlam.in/blog'
    });
  });

  app.get("/sitemap.xml", async(req, res) => {
    res.header('Content-Type', 'application/xml');
    

    try {
      const content = await renderdata();
      // const date = new Date().toLocaleString("en-CA",{year:'numeric',month:"2-digit",day:'2-digit',hour:'2-digit',minute:'2-digit', second:'2-digit'});
      // const d=date.split(',').join("T").split(" ").join("");
// Get the current date in the required format
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timezoneOffset = -now.getTimezoneOffset();
  const timezoneOffsetHours = String(Math.abs(timezoneOffset / 60)).padStart(2, '0');
  const timezoneOffsetMinutes = String(Math.abs(timezoneOffset % 60)).padStart(2, '0');
  const timezone = (timezoneOffset >= 0 ? '+' : '-') + timezoneOffsetHours + ':' + timezoneOffsetMinutes;

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timezone}`;
}

const lastmod = getCurrentDate(); // Get the current date in the required format
console.log(lastmod);


      res.render('sitemap', { urls:content ,date:lastmod});
      // console.log(thedata);
      
    } catch (error) {
      console.log(error);
    }
  
  });

  

const razorpayInstance = new Razorpay({
  key_id: process.env.RP_LIVE_KEY,
  key_secret: process.env.RP_SECRET_KEY
});

app.get('/payment/:num', async (req, res) => {
        const num=req.params.num
        const content = await renderdata();
    const foundObject = content.find(item => item.L1 === `/payment/${num}`);
   


        
  const amount = 29999; // Example amount in paise (₹500)
  const key_id = process.env.RP_LIVE_KEY; // Replace with your actual Razorpay key ID
  

  res.render('payments.ejs', { key_id, amount ,num,t1:foundObject.title,b1:foundObject.body}); // Pass key_id and amount to the EJS template
});
app.post('/create-order', async (req, res) => {
  const options = {
    amount: 29999, // Amount in smallest currency unit
    currency: 'INR',
    receipt: 'receipt#1',
    payment_capture: 1 // Auto capture
  };

  try {
    const response = await razorpayInstance.orders.create(options); // Change this line
    res.json(response); // Send the response back to the client
  } catch (error) {
    console.error(error);
    res.status(500).send("Some error occurred");
  }
});


         

 

app.get('/payment/success/:test', (req, res) => {
  // Verify the payment here, using Razorpay's verification process.
       const test=           req.params.test;
       console.log(test);
       
  
  // If payment is verified
  switch (test) {
    case test===1:
      const pdfName = 'pdfs.rar'; // Change this to the relevant PDF name based on your logic.
      const pdfPath = path.join(__dirname, 'pdfs', pdfName);
    
      // Set headers for the PDF file
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${pdfName}"`);
      res.sendFile(pdfPath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error sending file.');
        }
    });
      break;
      case test===2:
      const pdfName2 = 'pdfs.rar'; // Change this to the relevant PDF name based on your logic.
      const pdfPath2 = path.join(__dirname, 'pdfs', pdfName2);
    
      // Set headers for the PDF file
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${pdfName2}"`);
      res.sendFile(pdfPath2, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error sending file.');
        }
    });
      break;
      case test===3:
        const pdfName3 = 'pdfs.rar'; // Change this to the relevant PDF name based on your logic.
        const pdfPath3 = path.join(__dirname, 'pdfs', pdfName3);
      
        // Set headers for the PDF file
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${pdfName3}"`);
        res.sendFile(pdfPath3, (err) => {
          if (err) {
              console.error('Error sending file:', err);
              res.status(500).send('Error sending file.');
          }
      });
        break;
        case test===4:
          const pdfName4 = 'pdfs.rar'; // Change this to the relevant PDF name based on your logic.
          const pdfPath4 = path.join(__dirname, 'pdfs', pdfName4);
        
          // Set headers for the PDF file
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename="${pdfName4}"`);
          res.sendFile(pdfPath4, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error sending file.');
            }
        });
          break;
  
    default:
      case test===5:
        const pdfName5 = 'pdfs.rar'; // Change this to the relevant PDF name based on your logic.
        const pdfPath5 = path.join(__dirname, 'pdfs', pdfName5);
      
        // Set headers for the PDF file
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${pdfName5}"`);
        res.sendFile(pdfPath5, (err) => {
          if (err) {
              console.error('Error sending file:', err);
              res.status(500).send('Error sending file.');
          }
      });
        break;
    
  }
  

  // Send the PDF file
 
});









