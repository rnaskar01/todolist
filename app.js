const express= require ("express");
const bodyParser =  require( "body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect(`mongodb+srv://rakeshnaskar499:${import.meta.env.MONGO_KEY}@cluster0.lp3gy0w.mongodb.net/TodolistDB`,{useNewUrlparser: true});


const itemSchema = {
    name: String,
};
const item = mongoose.model("item", itemSchema);

const defaultArray = [];

app.get("/",(req,res)=>{
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date();
    const day = (date.toLocaleDateString("en-US", options));
    item.find({})
    .then((foundItems)=>{
      if(foundItems===0){
        redirect("/");
      }else {
        res.render("list.ejs",{kindofday: day, newListItems: foundItems});
      }

    })
    .catch((err)=>{
        console.log(err);
    });
});

app.post("/",(req,res) =>{
    const Itemname = req.body.newItem;
    const Item = new item({
        name: Itemname,
    });
        Item.save();
        res.redirect("/");
});
app.post("/delete", function(req,res){
    const finditemId = req.body.checkbox;
    item.findByIdAndRemove(finditemId)
    .catch(function (err) {
        console.log(err);
    });
    res.redirect("/");
});

app.listen(port,()=>{
    console.log(`Server is running in port ${port}`);
});