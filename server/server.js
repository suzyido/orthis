require('./config/config');
const morgan = require('morgan');
//var cors = require('cors');
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

//app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8100");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
  
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