const mongoose = require("mongoose");

//the model is responsible for creating the schema.

var JobSchema = new mongoose.Schema({
    jobNumber : {
        type: String,
        required: "Required"
    },
    connectionApp: {
        type: String,
        required: "Required"
    },
    connectionNum: {
        type: String,
        required: "Required"
    },
    username: {
        type: String,
        required: "Required"
    },
    password: {
        type: String,
        required: "Required"
    },
    additionalInfo: {
        type: String,
        required: "Required"
    },
    parentId:{
        type: mongoose.Schema.Types.ObjectId,
        required: "Required"
    },
    hardware: {
        type: Array
        // required: "Required",
        // default: [{
        //     name: {
        //         type: String,
        //         required: "Required"
        //     },
        //     description: {
        //         type: String,
        //         required: "Required"
        //     },
        //     ipAddress: {
        //         type: Number,
        //         required: "Required"
        //     },
        //     subnetMask: {
        //         type: Number,
        //         required: "Required"
        //     },
        //     defaultMask: {
        //         type: Number,
        //         required: "Required"
        //     },
        //     username: {
        //         type: String,
        //         required: "Required"
        //     },
        //     password: {
        //         type: String,
        //         required: "Required"
        //     }
        // }]
    }
}, { versionKey: false });

mongoose.model("Job", JobSchema);