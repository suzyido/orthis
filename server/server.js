require('./config/config');

const express = require('express');

const app = express();
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`App started on port ${port}`);
});

module.exports = {
    app
}