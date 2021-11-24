const path = require("path");
const express = require("express");
const hbs =  require("hbs");
const nodemailer = require("nodemailer");
const app = express();
require("./db/conn");
const Posts = require("./models/post");
const Users = require("./models/registration");
const { urlencoded } = require("body-parser");

const port = process.env.PORT||8001;
const staticPath = path.join(__dirname,"../public");
const templatesPath = path.join(__dirname,"./templates/views");
const partialsPath = path.join(__dirname,"./templates/partials");
console.log(templatesPath);
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set("view engine","hbs");

app.set("views",templatesPath);
hbs.registerPartials(partialsPath);
//app.use(express.static("public"));

express.urlencoded({extended:false})
// rendering static files with hbs
app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/signup",(req,res)=>{
    res.render("signup");
   // console.log(res.username)
})
app.get("/login",(req,res)=>{
    res.render("login");
});
app.get("/gallery",(req,res)=>{
    res.render("Gallery");
})
app.get("/dashboard",(req,res)=>{
    res.render("dashboard");
});
app.get("/",(req,res)=>{
    res.send("Welcome to Art Gallery Expo")
});

app.post("/signup",async(req,res)=>{
   // console.log(res.username);
    try {
        

        // console.log("User name is : "+req.body.username);
        // console.log("User email is : "+req.body.useremail);

        // console.log("User password is : "+req.body.userpassword);

        // console.log("User cpassword is : "+req.body.usercpassword);
        // console.log("User address is  : "+req.body.useraddress);

        const {username,useremail,userpassword,usercpassword,useraddress} = req.body;

        
        //console.log(`${username} and  ${useremail}`);

        // check for the user if he registered or not
        
        const isexisted = await Users.findOne({useremail});
        if(isexisted){
            res.send("Oops! This user already existed, Please try with different email");
        }
        else{
            if(usercpassword!=userpassword){
                res.send("Your passwords are not matching");
                
            }else{

            const user_details = new Users({username,useremail,userpassword,usercpassword,useraddress});
            await user_details.save();
                //sending the registrastion email
            

            //res.status(201).send("User registerd successfully");
            res.render("login");
            }
            //alert("Registerd successfully");
        }

    } catch (error) {
        res.status(400).send("Error occurring while registering");
        console.log(error);
    }
});

app.post("/login",async(req,res)=>{
    const{useremail,userpassword} = req.body;

    try {
        //check if user existed
        const existedUser = await Users.findOne({useremail});
        console.log(existedUser.useremail);
        console.log(existedUser.userpassword);

        if(existedUser.useremail === useremail && existedUser.userpassword===userpassword)
        {
            //res.send("You are now logged in");
            res.render("main",{
                UserName : existedUser.username,
                UserEmail : existedUser.useremail,
                UserAddress : existedUser.useraddress



            });
           
            

        }
        else{
            res.send("Oops! youre credintials were wrong");
        }
    } catch (error) {
        res.send("Oops! Something went wrong while sing in");
        
        
    }
})


// getting all the posts posted 

app.get("/ViewAll", async(req,res)=>{
   //res.send("I'm from view all");
   try {
    const viewallusers = await Posts.findById();
    const allusers = await Promise.all(
        viewallusers.map((key)=>{
            Posts.find();
        })
    );
    res.json(viewallusers);
    // res.send(allusers);
    // console.log(allusers);

    
    res.send()
    console.log(allusers);
    res.render("ViewAllPosts",{
        authorname : author,
        image : image,
        desc : desc

    });
       
   } catch (error) {
       console.log("Error occured while visiting the all posts");
   }
})


app.get("/Posts", (req,res)=>{
   res.render("Post");
})

app.post("/Post",async(req,res)=>{
    
   try {

    const author = req.body.author;
    const desc = req.body.desc;
    const image = req.body.image;

    console.log(author);
    console.log(desc);
    //console.log(image);
    const createdPost = new Posts({
       author,desc,image});

    await createdPost.save();

    res.send("Post created successfully");
       
   } catch (error) {
      console.log(error);
   }
})



app.listen(port,()=>{
    console.log("connect to the server on the port : "+port);
})