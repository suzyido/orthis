const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Option} = require('./../models/option');
const {users} = require('./seed/seed');

var postOptionsTest = () => {
    const data = 'test option';
    const type = 'text';
    const title = 'test title';
    
    it('should create a new option', (done) => {
        request(app)
        .post('/options')
        .set('x-auth', users[0].tokens[0].token)
        .send({type, data, title})
        .expect(200)
        .expect((res) => {
            expect(res.body.type).toBe(type);
            expect(res.body.title).toBe(title);
            expect(res.body.data).toBe(data);
        })
        .end((err, res) => {
            if(err) {
                return done(err);
            }
            Option.find({data}).then((options) => {
                expect(options.length).toBe(1);
                expect(options[0].title).toBe(title);
                expect(options[0].data).toBe(data);
                expect(options[0].type).toBe(type);
                expect(options[0].validated).toBeFalsy();
                done();
            }).catch((e) => done(e));
        });
    }); 

    it('should not create a new option if not autenticated', (done) => {
        request(app)
        .post('/options')
        .send({type, data, title})
        .expect(401)
        .end(done);
    });
};

module.exports = {
    postOptionsTest
}