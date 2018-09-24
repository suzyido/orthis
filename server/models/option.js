var mongoose = require('mongoose');

var OptionSchema = mongoose.Schema({
    type: {
        type: String,
        required: true,
        minlength: 1
    },
    title: {
        type: String
    }, 
    data: {
        type: String,
        required: true,
        minlength: 1
    },
    validated: {
        type: Boolean,
        default: false
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

var Option = mongoose.model('Option', OptionSchema);

module.exports = {
    Option
};