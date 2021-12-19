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
        // required: "Required",
        // default: [{
        //     jobNumber: {
        //         type: String,
        //         // required: "Required"
        //     },
        //     connectionApp: {
        //         type: String,
        //         // required: "Required"
        //     },
        //     connectionNum: {
        //         type: String,
        //         // required: "Required"
        //     },
        //     username: {
        //         type: String,
        //         // required: "Required"
        //     },
        //     password: {
        //         type: String,
        //         // required: "Required"
        //     },
        //     additionalInfo: {
        //         type: String,
        //         // required: "Required"
        //     },
        // }]
    }
}, { versionKey: false }); // versionKey is to refrain mongoose from adding a __v key to the schema, this is a mongoose versioning ability.

// CustomerSchema.plugin(mongoose_fuzzy_searching, { fields: ['name', 'code', 'city', 'state', 'zip', 'address','jobs'] });
mongoose.model("Customer", CustomerSchema);