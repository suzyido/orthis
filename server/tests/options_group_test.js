const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {OptionsGroup} = require('./../models/option-group');
const {UserOptionsGroupAudit} = require('../models/user-options-group-audit');
const {Option} = require('./../models/option');
const {users,
       optionsGroup} = require('./seed/seed');

var getOptionsGroupTest = () => {
    it('should return an optionGroup', (done) => {
        request(app)
        .get('/options_group')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.title).toBe('optionsGroup test1');
            expect(res.body.options.length).toBe(2);
            expect(res.body.options[1].option).toEqual(optionsGroup[0].options[1].option.toHexString());
        })
        .end((err, res) => {
            if(err) {
                return done(err);
            }
            UserOptionsGroupAudit.find({}).then((documents) => {
                expect(documents).toBeTruthy();
                expect(documents.length).toBe(1);
                done();
            }).catch((e) => done(e));
        });
    });

    it('should not return an OptionGroup', (done) => {
        request(app)
        .get('/options_group')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.options.length).toBe(2);
        })
        .end((err, res) => {
            if(err) {
                return done(err);
            }
            request(app)
            .get('/options_group')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end((err, res) => {            
                if(err) {
                    return done(err);
                }
                UserOptionsGroupAudit.find({}).then((documents) => {
                    expect(documents).toBeTruthy();
                    expect(documents.length).toBe(1);
                    done();
                }).catch((e) => done(e));
            });
        });
    });
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
                expect(groups.length).toBe(2);
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