const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Option} = require('./../models/option');
const {User} = require('./../models/user');
const {options, populateOptions, users, populateUsers} = require('./seed/seed');

beforeEach(populateOptions);
beforeEach(populateUsers);

describe('POST /options', () => {
    it('should create a new option', (done) => {
        const data = 'test option';
        const type = 'text';
        const title = 'test title';
        
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
                done(err);
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
});

describe('GET /users/me', () => {
    it('should return user if autenticated', (done) => {
      request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
    });
  
    it('should return 401 if not autenticated', (done) => {
      request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
    });
  });
  
  describe('POST /users', () => {  
    it('should create a user', (done) => {
      var newUser = {
        email: 'suzyido3@yahoo.com',
        password: 'userThreePass',  
      };
  
      request(app)
      .post('/users')
      .send(newUser)
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body.email).toBe(newUser.email);
        expect(res.body._id).toBeTruthy();
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        User.find({email: newUser.email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.length).toBe(1);
          expect(user.password).not.toBe(newUser.password);
          done();
        }).catch((err) => done(err));
      });
    });

    it('should return validation errors if request invalid', (done) => {
      request(app)
      .post('/users')
      .send({email: 'abcd@sdf.com', password: 'sdfds'})
      .expect(400)
      .end(done);
    });

    it('should not create user if email in use', (done) => {
      request(app)
      .post('/users')
      .send({email: users[0].email, password: users[0].password})
      .expect(400)
      .end(done);
    });
  });

  describe('POST /users/login', () => {
    it('should return a token when a valid email/password is sent', (done) => {
      request(app)
      .post('/users/login')
      .send({email: users[1].email, password: users[1].password})
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(users[1].email);
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.toObject().tokens[1]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((err) => done(err));
      });
    });
  
    it('should return 400 when an invalid email/password is sent', (done) => {
      request(app)
      .post('/users/login')
      .send({email: users[1].email, password: 'wrongpassword'})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((err) => done(err));
      });
    }); 
  });
  
  describe('DELETE /users/me/token', () => {
    it('should delete the token for this logged in user', (done) => {
      request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        User.findOne({email: users[0].email}).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((err) => done(err));
      })
    });
  
    it('should not delete the token for this non logged in user', (done) => {
      request(app)
      .delete('/users/me/token')
      .expect(401)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        done();
      })    
    }); 
  });


