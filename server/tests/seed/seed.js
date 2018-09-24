const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Option} = require('./../../models/option');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
{
    _id: userOneId,
    email: 'suzyido@yahoo.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}, 
{
    _id: userTwoId,
    email: 'suzyido1@yahoo.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}];

const options = [
{
    _id: new ObjectID(),
    type: 'text',
    title: 'first test title',
    data: 'first test option',
    _creator: userOneId
},
{
    _id: new ObjectID(),
    type: 'text',
    title: 'first test title',
    data: 'second test option',
    _creator: userTwoId
}];

const populateOptions = (done) => {
    Option.deleteMany({}).then(() => {
      return Option.insertMany(options);
    }).then(() => done());
};
  
const populateUsers = (done) => {
    User.deleteMany({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = {
    options,
    populateOptions,
    users,
    populateUsers
};