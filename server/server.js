require('./config/config');

var {mongoose} = require('./db/mongoose');
var {Option} = require('./models/option');
const express = require('express');
var bodyParser = require('body-parser');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.get('/options_group', (req, res) => {
    console.log('In get /options_group');
    return res.send();
});

app.post('/options', (req, res) => {
    console.log(JSON.stringify(req.body));
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

app.listen(port, () => {
    console.log(`App started on port ${port}`);
});

module.exports = {
    app
}