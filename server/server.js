require('./config/config');

const _ = require('lodash');
const {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Option} = require('./models/option');
var {OptionGroup} = require('./models/option-group');
const express = require('express');
var bodyParser = require('body-parser');

var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/options', authenticate, (req, res) => {
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
});

var addOptionToGroup = function(optionGroup, option) {
    var objOption = {_id: option};

    OptionGroup.findOneAndUpdate(
        {_id: optionGroup._id}, 
        { $push: { options: objOption} }).then((option) => {
        if(!option) {
            console.log(`Error updating optionGroup ${optionGroup._id} with option ${option}. Null option returned`);
        }
    }).catch((e) => {
        console.log(`Error updating optionGroup ${optionGroup._id} with option ${option}`);
    });
}

var createOptions = function(req, res, optionGroup) {
    req.body.options.forEach(item => {
        console.log(item);
        var option = new Option({
            type: item.type,
            title: item.title,
            data: item.data
        });
        option.save().then((optionItem) => {
            addOptionToGroup(optionGroup, optionItem._id);
        }, (err) => {
            if(err) {
                res.status(400).send(err);
            }
        });        
    });
    res.send({id: optionGroup._id});
}

app.post('/options_group', authenticate, (req, res) => {
    var optionGroup = new OptionGroup({
        title: req.body.title,
        options: [],
        _creator: req.user._id
    });

    optionGroup.save().then((optionsGroup) => {
         createOptions(req, res, optionsGroup);
    }, (err) => {
        if(err) {
            res.status(400).send(err);
        }
    });
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }, (err) => {
        if(err) {
            res.status(400).send(err);
        }
    }).then((token) => {
        res.header('x-auth', token).send(user);
    })    
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);    
        });
   }).catch((err) => {
        res.status(400).send(err);
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.listen(port, () => {
    console.log(`App started on port ${port}`);
});

module.exports = {
    app
}