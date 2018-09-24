const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Option} = require('./../models/option');
const {options, populateOptions} = require('./seed/seed');

beforeEach(populateOptions);

describe('POST /options', () => {
    it('should create a new option', (done) => {
        const data = 'test option';
        const type = 'text';
        
        request(app)
        .post('/options')
        .send({type, data})
        .expect(200)
        .expect((res) => {
            expect(res.body.type).toBe(type);
            expect(res.body.data).toBe(data);
        })
        .end((err, res) => {
            if(err) {
                done(err);
            }
            Option.find({data}).then((options) => {
                expect(options.length).toBe(1);
                expect(options[0].data).toBe(data);
                expect(options[0].type).toBe(type);
                expect(options[0].validated).toBeFalsy();
                done();
            }).catch((e) => done(e));
        });
    });
});



