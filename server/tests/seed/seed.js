const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Option} = require('./../../models/option');
const {OptionsGroup} = require('./../../models/option-group');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const optionOneId = new ObjectID();
const optionTwoId = new ObjectID();

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
    _id: optionOneId,
    type: 'text',
    title: 'first test title',
    data: 'first test option',
    _creator: userOneId
},
{
    _id: optionTwoId,
    type: 'text',
    title: 'first test title',
    data: 'second test option',
    _creator: userTwoId
}];

const optionsGroup = [{
	title: "optionsGroup test1",
	options: [{option: optionOneId}, {option: optionTwoId}],
    _creator: userOneId
}];

const populateOptionsGroup = (done) => {
    OptionsGroup.deleteMany({}).then(() => {
        return OptionsGroup.insertMany(optionsGroup);
    }, (err) => {
        if(err) {
            console.log('Error deleting seed data for OptionsGroup', err);
            done(err);
        }
    }).then(() => done(), (err) => {
        console.log('Error populating seed data for OptionsGroup', err);
        done(err);
    });
};

const populateOptions = (done) => {
    Option.deleteMany({}).then(() => {
      return Option.insertMany(options);
    }, (err) => {
        if(err) {
            console.log('Error deleting seed data for Options', err);           
            done(err);
        }
    }).then(() => done(), (err) => {
        if(err) {
            console.log('Error populating seed data for Options', err);
            done(err);
        }
    });
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
    optionsGroup,
    populateOptionsGroup,
    users,
    populateUsers
};