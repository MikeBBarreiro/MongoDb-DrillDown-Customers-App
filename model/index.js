const mongoose = require("mongoose");

// const options = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true,
// };
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://mbuser:mbarreiro@cluster0.hong0.mongodb.net/customerConnectionDb?retryWrites=true&w=majority", (error) => {
    if(!error){
        console.log('Success!');
    }else {
        console.log('Error on connecting to DB');
    }
})

//mongodb+srv://mbuser:mbarreiro@cluster0.hong0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

// mongoose.connect("mongodb://localhost:27017/[your database name]") this is the local conneciton
// {useNewUrlParser: true} //this is to simply remove a tp use new parser warning if arrised.

const Customer = require("./customer.model");
const Job = require("./job.model");