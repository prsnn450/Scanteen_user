const mongoose= require('mongoose');

const signupschema= mongoose.Schema({
    Name: {
        type : String,
        required:true
    },
    phoneNumber: {
        type : Number,
        unique: true,
        required:true
    },
    password: {
        type : String,
        required: true
    },
    orgId: {
        type : String,
        required : true
    },
    status: {
        type : String,
    }
});

module.exports = mongoose.model("User",signupschema);