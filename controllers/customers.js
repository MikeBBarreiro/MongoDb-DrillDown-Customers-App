const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const CustomerModel = mongoose.model("Customer");// this is the Customer model created in the model/customer.model.js
const JobModel = mongoose.model("Job");

var ObjectId = require('mongodb').ObjectId;

router.post("/fuzzySearchCustomers", function(req, res) {
    console.log(req.body);
    var resultsArray = [];
    if (req.body.search) {
       const regex = new RegExp(escapeRegex(req.body.search), 'gi');
        CustomerModel.find({ $text: { $search: regex} }, function(err, returnedResults) {
            if(err) {
                console.log(err);
                res.send(err);
            } else {
            res.send({ results: returnedResults });
            }
        });
    }
});

router.post("/createCustomer", (req, res) => {
    CustomerModel.create(req.body.obj,(err, docs) => {
        res.send(JSON.stringify(docs));
    });
});

router.put("/updateCustomer", (req, res) => {
    CustomerModel.updateOne({_id: req.body.id}, {$set: req.body.updatedObj}, (err, docs) => {
        if(!err){
            console.log('Customer : ' + req.body.id + ' is updated');
            res.send(JSON.stringify({data: docs, updatedData: req.body.updatedObj}));
        }else{
            console.log(err);
            res.send('ERROR!');
        }
    });
});

router.get("/getCustomers", (req, res) => {
    CustomerModel.find((err, docs) => {
        if(!err){
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({data: docs}));
        }else{
            res.send("ERROR!");
        }
    }).lean(); //.lean is needed to make this fetch work.
});

var updateCustomerJobsArray = (customerId, jobId, jobName, isRemove, res) => {
    if(isRemove){
        CustomerModel.updateOne({_id: customerId}, { $pull: { 'jobs': { jobId: ObjectId(jobId)}}}).then((err, docs) => {
            if(!err){
                console.log('job is removed from customers collection :' + jobId + ' from customer ' + customerId);
            }else{
                console.log(err);
            }
        }).catch((err) => {
            console.log(err);
        });
    }else{
        CustomerModel.updateOne({_id: customerId}, { $push : {jobs : {jobId, name: jobName}}}).then(() => {
            console.log('Customer ID:' + customerId + ' is Updated');
        }).catch((err) => {
            console.log(err);
        });
    }
}

router.delete("/deleteCustomer", (req, res) => {
    CustomerModel.deleteOne({_id: req.body.id}, (err, docs) => {
        if(!err){
            console.log('sucsessful deletion of Customer: ' + req.body.id);
            JobModel.deleteMany({parentId: req.body.id}, (err, docs) => {
                if(!err){
                    console.log('Jobs are removed');
                }
            });
            res.send(JSON.stringify( {data: 'sucsessful deletion of Customer: ' + req.body.id}));
        }else{
            res.send("ERROR!");
        }
    }).lean();
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = {
    router: router,
    updateCustomerJobsArray: updateCustomerJobsArray
}
// module.exports.updateCustomerJobsArray = updateCustomerJobsArray;
