const connection = require("./model"); //connection code model/index.js connects to the db.
const express = require("express");
const app = express();
const path = require("path"); //available from node
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000

//Controllers
const CustomerController = require("./controllers/customers");
const JobController = require("./controllers/jobs");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("views", path.join(__dirname, "/views/"));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')); //allows external css and js files to your express application.

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get("/", (req,res) => {
    res.render("index", {});
})
app.use("/", CustomerController.router, JobController.router) //this tells node which controller we'll be used here at route /.

// Heroku dynamically assigns your app a port. Heroku adds the port to the env. 
//PORT 3000 is for local Dev Enviromnet.
app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}` );
})

