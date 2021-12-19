const connection = require("./model"); //connection code model/index.js connects to the db.
const express = require("express");
const app = express();
const path = require("path"); //available from node
const expressHandleBars = require("express-handlebars");// or deconstruct this with import { engine } from 'express-handlebars';
const bodyParser = require("body-parser");

//Controllers
const CustomerController = require("./controllers/customers");
const JobController = require("./controllers/jobs");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.set("views", path.join(__dirname, "/views/"));

// const hbs = expressHandleBars.create({
//     extname : "hbs", 
//     defaultLayout : "mainlayout",
//     layoutsDir: __dirname + "/views/layouts",

//     //create custom helpers
//     helpers: {}
// })

// app.engine("hbs", expressHandleBars.engine({
//     extname : "hbs", 
//     defaultLayout : "mainlayout",
//     layoutsDir: __dirname + "/views/layouts"
// }));
// app.engine("hbs", hbs.engine);
// app.set("view engine", "hbs");
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public')); //allows external css and js files to your express application.

// app.set('views', __dirname + '/views');

app.get("/", (req,res) => {
    // res.send('Hello welcome to allpax');
    res.render("index", {});
})
app.use("/", CustomerController.router, JobController.router) //this tells node which controller we'll be used here.
// app.use("/", CustomerController) //this tells node which controller we'll be used here.

app.listen("3000", () => {
    console.log("Server running on PORT: 3000");
})

