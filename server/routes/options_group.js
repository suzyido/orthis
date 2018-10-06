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

var updateUserOptionsGroupOptions = (optionsGroup, res) => {
    const optionIds = optionsGroup.options.map(option => option._id);
            
    Option.find({_id: {$in: optionIds}})
    .then((options) => {
        optionsGroup.options.forEach((optionGroupOption) => {
            options.forEach((option) => {
                if(JSON.stringify(optionGroupOption._id) == JSON.stringify(option._id)) {
                    optionGroupOption.type = option.type;
                    optionGroupOption.title = option.title;
                    optionGroupOption.data = option.data;
                }
            });
        });
        return res.send(optionsGroup);        
    }, (err) => {
        if(err) {
            return res.status(400).send(err);
        }
    });
}

var updateUserOptionsGroupAudit = (req, optionsGroup, res) => {
    var userOptionsGroupAudit = 
        new UserOptionsGroupAudit({
            'user': req.user, 
            'optionsGroup': optionsGroup._id
        });

    userOptionsGroupAudit.save().then(() => {
        updateUserOptionsGroupOptions(optionsGroup, res);
    }, (err) => {
        if(err) {
            console.log('Error in updateUserOptionsGroupAudit: ', err);
            return res.status(400).send(err);
        }
    });
}

var handleGetOptionsGroup = (req, res) => {
    UserOptionsGroupAudit.find({user: req.user}).then((userOptionsGroupAudit) => {
        var optionsGroupAudit = userOptionsGroupAudit
                                .map((optionsGroup) => optionsGroup.optionsGroup);
        
        OptionsGroup.findOne({_id: {$nin: optionsGroupAudit}})
        .lean() // convert the Mongoose Object into a simple js object so we can add items later one
        .then((optionsGroup) => {
            if(optionsGroup) {
                updateUserOptionsGroupAudit(req, optionsGroup, res);
            }
            else {
               return res.send({}); 
            }
        //     const optionIds = optionsGroup.options.map(option => option._id);
            
        //     Option.find({_id: {$in: optionIds}})
        //     .then((options) => {
        //         optionsGroup.options.forEach((optionGroupOption) => {
        //             options.forEach((option) => {
        //                 if(JSON.stringify(optionGroupOption._id) == JSON.stringify(option._id)) {
        //                     optionGroupOption.type = option.type;
        //                     optionGroupOption.title = option.title;
        //                     optionGroupOption.data = option.data;
        //                 }
        //             });
        //         });
        //         return res.send(optionsGroup);        
        //     }, (err) => {
        //         if(err) {
        //             return res.status(400).send(err);
        //         }
        //     });
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