require('./config/config');

const _ = require('lodash');
var {mongoose} = require('./db/mongoose');
var {Option} = require('./models/option');
const express = require('express');
var bodyParser = require('body-parser');

var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.get('/options_group', (req, res) => {
    console.log('In get /options_group');
    return res.send();
});

app.post('/options', (req, res) => {
    var option = new Option({
        type: req.body.type,
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