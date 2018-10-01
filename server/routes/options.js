var {Option} = require('./../models/option');

var handlePostOptions = (req, res) => {
    var option = new Option({
        type: req.body.type,
        title: req.body.title,
        data: req.body.data
    });
    
    option.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        if(err) {
            res.status(400).send(err);
        }
    });
};

module.exports = {
    handlePostOptions
};
