const express = require("express");
const mongoose = require("mongoose");


const router = express.Router();
const JobModel = mongoose.model("Job");// this is the Customer model created in the model/customer.model.js

const CustomerController = require("./customers");

var ObjectId = require('mongodb').ObjectId; //Access to new ObjectId to create Id's from here for DB.

// router.get("/add", (req, res) => {
//     res.render('add job');
// });

// router.post("/add", (req, res) => {
//     res.render('add job');
//     console.log(req.body);
//     // var job = new CustomerModel();
//     // job.jobs = req.body

// });

router.post("/fuzzySearchJobs", function(req, res) {
    console.log(req.body);
    var resultsArray = [];
    if (req.body.search) {
       const regex = new RegExp(escapeRegex(req.body.search), 'gi');
       console.log(regex);
        //    {"$text":{"$search":"Java MongoDB"}}
        // { "name": regex }
        JobModel.find({ $text: { $search: regex} }, function(err, returnedResults) {
            if(err) {
                console.log(err);
                res.send(err);
            } else {
            res.send({ results: returnedResults });
            }
        });
    }
});

// url/course/list

//Each job is fetched one at a time based off wich customer is selected to review.
router.post("/getJobByID/", (req, res) => {
    // console.log(req.body);
    JobModel.find({parentId: req.body.id}, (err, docs) => {
        if(!err){
            
            // res.setHeader('Content-Type', 'application/json');
            // console.log(docs);
            // console.log(req.body);
            // const jobs =  docs.jobs;
            // console.log(docs[0].jobs); //docs lives inside a collection, docs is another way of saying json data
            // console.log(docs);
            // res.send(JSON.stringify( {data: docs} ));
            res.send(JSON.stringify({data: docs}));
        }else{
            res.send("ERROR!");
        }
    }
    ).lean(); //.lean is needed to make this fetch work.
});

// /addAJob
router.post("/addAJob", (req, res) => {
    var objId;
    var data = req.body.obj
    //A Mongoose model does not have a insertOne method. Use the create method instead:
    // {parentId: req.body.obj.parentId}, 
    JobModel.create({jobNumber: data.jobNumber,connectionApp: data.connectionApp,connectionNum: data.connectionNum,username: data.username,password: data.password,additionalInfo: data.additionalInfo,parentId: data.parentId}, 
        (err, docs) => {
            // console.log(docs);
            if(!err){
                CustomerController.updateCustomerJobsArray(docs.parentId, docs._id, data.jobNumber, false, res);
                data.jobId = docs._id;
                // console.log(data);
                res.send(JSON.stringify(data));
                // res.send();
            }else{
                res.send("ERROR!");
            }
    });
    
});

router.put("/updateJob/", (req, res) => {
    // console.log(req.body);
    // console.log(req.body.updatedJob)
    JobModel.updateOne({_id: req.body.id}, {$set: req.body.updatedJob}, (err, docs) => {
        if(!err){
            
            // res.setHeader('Content-Type', 'application/json');
            // console.log(docs);
            // console.log(req.body);
            // const jobs =  docs.jobs;
            // console.log(docs[0].jobs); //docs lives inside a collection, docs is another way of saying json data
            // console.log(docs);
            // res.send(JSON.stringify( {data: docs} ));
            res.send(JSON.stringify({data: docs, updatedData: req.body.updatedJob}));
        }else{
            console.log(err);
            res.send("ERROR! :" + err);
        }
    }
    ).lean(); //.lean is needed to make this fetch work.
});

router.delete("/deleteJobById", (req, res) => {
    JobModel.deleteOne({_id: req.body.id}, (err, docs) => {
        if(!err){
            console.log('sucsessful deletion of job id: ' + req.body.id);
            CustomerController.updateCustomerJobsArray(req.body.customerId, req.body.id, 'jobNumber', true, res);
            res.send(JSON.stringify( {data: 'sucsessful deletion of job id: ' + req.body.id + ''} ));
        }else{
            res.send("ERROR!");
        }
    }).lean();
});

router.delete("/deleteHardwareById", (req, res) => {
    // $pull, is a mongodb method to pull somthing from an array.
    JobModel.updateOne({_id: req.body.jobId}, { $pull: { 'hardware': { _id: ObjectId(req.body.hardwareId) }}}, (err, docs) => {
        if(!err){
            console.log('sucsessful deletion of hardware id: ' + req.body.hardwareId);
            res.send(JSON.stringify( {data: 'sucsessful deletion of hardware id: ' + req.body.hardwareId} ));
        }else{
            res.send("ERROR!");
        }
    }).lean();
});

router.post("/addHardware", (req, res) => {
    var data = req.body.obj;
    var id = new ObjectId();
    data._id = id;

    JobModel.updateOne({_id: data.parentId}, { $push : {hardware : data}}, (err, docs) => {
        if(!err){
            res.send({text: 'New Hardware ' + req.body.obj.name + ', was added.', data: data});
        }else{
            console.log(err);
            res.send('ERROR!');
        }
        
    });
});


router.put("/updateHardware", (req, res) => {
    // console.log(req.body);
    // console.log(req.body.updatedJob)
    JobModel.updateOne({_id: req.body.id}, {$set: req.body.updatedHardware}, (err, docs) => {
        if(!err){
            res.send(JSON.stringify({data: docs, updatedData: req.body.updatedHardware}));
        }else{
            console.log(err);
            res.send("ERROR! :" + err);
        }
    }
    ).lean(); //.lean is needed to make this fetch work.
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = {
    router: router
    // removeJobs: removeJobs //this function has been ommitted, keeping to later investigate loginc performence.
}
// module.exports.removeJobs = removeJobs;
//TODO OPTIMISE 2 controllers exporting each other has casued an issue with heper function read, look into this to optimise.