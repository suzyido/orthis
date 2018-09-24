const {ObjectID} = require('mongodb');

const {Option} = require('./../../models/option');

const options = [
{
    _id: new ObjectID(),
    type: 'text',
    data: 'first test option'
},
{
    _id: new ObjectID(),
    type: 'text',
    data: 'second test option'
}];

const populateOptions = (done) => {
    Option.deleteMany({}).then(() => {
      return Option.insertMany(options);
    }).then(() => done());
};

module.exports = {
    options,
    populateOptions
};