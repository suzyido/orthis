require('./config/config');

const _ = require('lodash');
var {mongoose} = require('./db/mongoose');
const express = require('express');
var bodyParser = require('body-parser');
var {authenticate} = require('./middleware/authenticate');
var {handlePostOptions} = require('./routes/options');
var {handlePostOptionsGroup, 
     handleGetOptionsGroup} = require('./routes/options_group');
var {handlePostUsers,
     handlePostUsersLogin,
     handleDeleteUsersMe,
     handleGetUsersMe} = require('./routes/users');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/options', authenticate, handlePostOptions);
app.post('/options_group', authenticate, handlePostOptionsGroup);
app.get('/options_group', authenticate, handleGetOptionsGroup);
app.post('/users', handlePostUsers);
app.post('/users/login', handlePostUsersLogin);
app.delete('/users/me/token', authenticate, handleDeleteUsersMe);
app.get('/users/me', authenticate, handleGetUsersMe);

app.listen(port, () => {
    console.log(`App started on port ${port}`);
});

module.exports = {
    app
}