const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {OptionsGroup} = require('./../models/option-group');
const {Option} = require('./../models/option');
const {users} = require('./seed/seed');

var getOptionsGroupTest = () => {

};

var postOptionsGroupTest = () => {
    const title = 'optionsGroup test';
    const type = 'text';
    const data = 'data';

    const optionsGroup = {
        title,
        options: [{type, data},
                  {type, data}]
    };

    const optionsGroupNoTitle = {
        options: [{type, data},
                  {type, data}]
    };
    it('should create a new options_group test1', (done) => {
        request(app)
        .post('/options_group')
        .set('x-auth', users[0].tokens[0].token)
        .send(optionsGroup)
        .expect(200)
        .end((err, res) => {
            if(err) {
                return done(err);
            }
            OptionsGroup.find({}).then((groups) => {
                expect(groups.length).toBe(3);
                done();
            }).catch((e) => done(e));
        });
    });

    it('should create a new options_group test2', (done) => {    
        request(app)
        .post('/options_group')
        .set('x-auth', users[0].tokens[0].token)
        .send(optionsGroup)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBeTruthy();
        })
        .end((err, res) => {
            if(err) {
                return done(err);
            }
            OptionsGroup.findOne({title}).then((group) => {
                expect(group).toBeTruthy();
                expect(group.options.length).toBe(2);
                Option.findById(group.options[0]._id).then((optionObj) => {
                    expect(optionObj.data).toBe(data);
                    expect(optionObj.type).toBe(type);
                    done();
                }).catch((e) => done(e));
            }).catch((e) => done(e));
        }); 
    });

    it('should not create a new option_group if not autenticated', (done) => {
        request(app)
        .post('/options_group')
        .send(optionsGroup)
        .expect(401)
        .end(done);
    });

    it('should not create a new option_group with no title', (done) => {
        request(app)
        .post('/options_group')
        .set('x-auth', users[0].tokens[0].token)
        .send(optionsGroupNoTitle)
        .expect(400)
        .end(done);
    });
};

module.exports = {
    getOptionsGroupTest,
    postOptionsGroupTest
};