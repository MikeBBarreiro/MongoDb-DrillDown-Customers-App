const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const JobModel = mongoose.model("Job");// this is the Customer model created in the model/customer.model.js
const CustomerController = require("./customers");
var ObjectId = require('mongodb').ObjectId; //Access to new ObjectId to create Id's from here for DB.

router.post("/fuzzySearchJobs", function(req, res) {
    var resultsArray = [];
    if (req.body.search) {
       const regex = new RegExp(escapeRegex(req.body.search), 'gi');
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
    JobModel.find({parentId: req.body.id}, (err, docs) => {
        if(!err){
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
    JobModel.create({jobNumber: data.jobNumber,connectionApp: data.connectionApp,connectionNum: data.connectionNum,username: data.username,password: data.password,additionalInfo: data.additionalInfo,parentId: data.parentId}, 
        (err, docs) => {
            if(!err){
                CustomerController.updateCustomerJobsArray(docs.parentId, docs._id, data.jobNumber, false, res);
                data.jobId = docs._id;
                res.send(JSON.stringify(data));
            }else{
                res.send("ERROR!");
            }
    });
    
});

router.put("/updateJob/", (req, res) => {
    JobModel.updateOne({_id: req.body.id}, {$set: req.body.updatedJob}, (err, docs) => {
        if(!err){
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
}
// module.exports.removeJobs = removeJobs;
//TODO OPTIMISE 2 controllers exporting each other has casued an issue with heper function read, look into this to optimise.