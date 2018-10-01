const _ = require('lodash');
var {User} = require('./../models/user');

var handlePostUsers = (req, res) => {
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
};

var handlePostUsersLogin = (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);    
        });
   }).catch((err) => {
        res.status(400).send(err);
    });
};

var handleDeleteUsersMe = (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
};

var handleGetUsersMe = (req, res) => {
    res.send(req.user);
};

module.exports = {
    handlePostUsers,
    handlePostUsersLogin,
    handleDeleteUsersMe,
    handleGetUsersMe
};