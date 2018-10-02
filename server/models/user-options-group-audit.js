var mongoose = require('mongoose');

var UserOptionsGroupAuditSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    optionsGroup: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

var UserOptionsGroupAudit = mongoose.model('UserOptionsGroupAudit', UserOptionsGroupAuditSchema);

module.exports = {
    UserOptionsGroupAudit
};