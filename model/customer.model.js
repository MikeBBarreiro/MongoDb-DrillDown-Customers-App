const mongoose = require("mongoose");

//the model is responsible for creating the schema.

var CustomerSchema = new mongoose.Schema({
    name : {
        type: String,
        required: "Required"
    },
    code: {
        type: String,
        required: "Required"
    },
    address: {
        type: String,
        required: "Required"
    },
    city: {
        type: String,
        required: "Required"
    },
    state: {
        type: String,
        required: "Required"
    },
    zip: {
        type: Number,
        required: "Required"
    },
    jobs: {
        type: Array
    }
}, { versionKey: false }); // versionKey is to refrain mongoose from adding a __v key to the schema, this is a mongoose versioning ability.

mongoose.model("Customer", CustomerSchema);