const {app} = require('./../server');
const {populateOptions, 
       populateOptionsGroup, 
       populateUsers,
       populateUserOptionsGroupAudit} = require('./seed/seed');
const {postOptionsGroupTest, 
       getOptionsGroupTest} = require('./options_group_test');
const {postOptionsTest} = require('./options_test');
const {getUsersMeTest,
       postUsersTest,
       postUsersLoginTest,
       deleteUsersMeTest} = require('./users_test');

beforeEach(populateUsers);
beforeEach(populateOptions);
beforeEach(populateOptionsGroup);
beforeEach(populateUserOptionsGroupAudit);

describe('GET /options_group', getOptionsGroupTest);

describe('POST /options_group', postOptionsGroupTest);

describe('POST /options', postOptionsTest);

describe('GET /users/me', getUsersMeTest);
 
describe('POST /users', postUsersTest);

describe('POST /users/login', postUsersLoginTest);
  
describe('DELETE /users/me/token', deleteUsersMeTest);

