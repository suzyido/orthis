var mongoose = require('mongoose');

var OptionsGroupSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    options:[{
        option: {
            type: mongoose.Schema.Types.ObjectId, 
//            ref: 'Option',
            required: true
        },
        selectedCount: {
            type: Number,
            default: 0
        },
        lastShownAt: {
            type: Date,
            default: null
        },
        lastSelectedAt: {
            type: Date,
            default: null
        }    
    }],
    validated: {
        type: Boolean,
        default: false
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}); 

var OptionsGroup = mongoose.model('OptionsGroup', OptionsGroupSchema);

module.exports = {
    OptionsGroup
};