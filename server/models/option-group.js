var mongoose = require('mongoose');

var OptionGroupSchema = new mongoose.Schema({
    options:[{
        option: {
            type: Schema.Types.ObjectId, 
            ref: 'Option',
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
    }]
}); 

var OptionGroup = mongoose.model('OptionGroup', OptionGroupSchema);

module.exports = {
    OptionGroup
};