var mongoose = require('mongoose');

var OptionSchema = mongoose.Schema({
    type: {
        type: String,
        minlength: 1
    },
    title: {
        type: String
    }, 
    data: {
        type: String,
        minlength: 1
    }
});

var Option = mongoose.model('Option', OptionSchema);

module.exports = {
    Option
};