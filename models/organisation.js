const mongoose= require('mongoose');

const organisationschema = mongoose.Schema({
    orgId:{
        type: String,
        required: true
    },
    orgName:{
        type: String,
        required: true,
    },
    orgPhoneNumber:{
        type: Number,
        required: true,
    },
    orgPassword:{
        type: String,
        required: true,
    },
    orgIp:{
        type: String,
        required: true,
    },
    status:{
        type: String,
    }
});

module.exports= mongoose.model("Organisation",organisationschema);