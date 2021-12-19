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
    }
}, { versionKey: false }); // versionKey is to refrain mongoose from adding a __v key to the schema, this is a mongoose versioning ability.

mongoose.model("Job", JobSchema);