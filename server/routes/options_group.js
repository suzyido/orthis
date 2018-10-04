var {OptionsGroup} = require('./../models/option-group');
var {Option} = require('./../models/option');
var {UserOptionsGroupAudit} = require('../models/user-options-group-audit');

var addOptionToGroup = (res, optionsGroup, option, isLastOption) => {
    var objOption = {_id: option};
    OptionsGroup.findOneAndUpdate(
        {_id: optionsGroup._id}, 
        { $push: { options: objOption} }).then(() => {
            if(isLastOption) {
                res.send({_id: optionsGroup._id});            
            }
    }).catch((e) => {
        console.log(`Error updating optionsGroup ${optionsGroup._id} with option ${option}`);
        res.send(e); 
    });
}

var createOptions = (req, res, optionsGroup) => {
    var counter = req.body.options.length;
    var isLastOption = false;

    req.body.options.forEach(item => {
        var option = new Option({
            type: item.type,
            title: item.title,
            data: item.data
        });
        option.save().then((optionItem) => {
            if(0 == --counter) {
                isLastOption = true;
            }        
            addOptionToGroup(res, optionsGroup, optionItem._id, isLastOption);
        }, (err) => {
            if(err) {
                console.log('Error saving option', err);
            }
        });        
    });
}

var handlePostOptionsGroup = (req, res) => {
    var optionsGroup = new OptionsGroup({
        title: req.body.title,
        options: [],
        _creator: req.user._id
    });

    optionsGroup.save().then((optionsGroup) => {
         createOptions(req, res, optionsGroup);
    }, (err) => {
        if(err) {
            res.status(400).send(err);
        }
    });
}

var updateUserOptionsGroupAudit = (user, optionsGroup) => {
    var userOptionsGroupAudit = new UserOptionsGroupAudit({user, optionsGroup});
    userOptionsGroupAudit.save().then(() => {}, (err) => {
        if(err) {
            console.log('Error in updateUserOptionsGroupAudit: ', err);
        }
    });
}

var handleGetOptionsGroup = (req, res) => {
    console.log('In handleGetOptionsGroup with', req.body);
    UserOptionsGroupAudit.find({user: req.user}).then((userOptionsGroupAudit) => {
        var optionsGroupAudit = userOptionsGroupAudit.map((optionsGroup) => { 
            return optionsGroup.optionsGroup});
        OptionsGroup.findOne({_id: {$nin: optionsGroupAudit}}).then((optionsGroup) => {
            if(optionsGroup) {
                updateUserOptionsGroupAudit(req.user, optionsGroup._id);
            }
            res.send(optionsGroup);    
        }, (err) => {
            if(err) {
                return res.status(400).send(err);
            }
        });
                
    }, (err) => {
        if(err) {
            return res.status(400).send(err);
        }
    });
};

module.exports = {
    handlePostOptionsGroup,
    handleGetOptionsGroup
}