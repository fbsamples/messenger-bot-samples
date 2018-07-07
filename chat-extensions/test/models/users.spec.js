import {expect} from 'chai';
import {describe} from 'mocha';

import Knex from '../../db/knex';
import Users from '../../models/users';

describe('User', () => {
  beforeEach((done) => {
    Knex.migrate.latest()
      .then(() => {
        Knex.seed.run().then(() => done());
      });
  });

  afterEach((done) => {
    Knex.migrate.rollback().then(() => done());
  });

  describe('get', () => {
    it('returns a User', (done) => {
      Users.get(1)
        .then((user) => {
          expect(user).to.be.an('object');
          expect(user).to.have.property('fbId');
          expect(user.fbId).to.equal('1');
          done();
        });
    });
  });

  describe('findOrCreate', () => {
    it('creates and returns a new User', (done) => {
      Users.findOrCreate({
        // eslint-disable-next-line camelcase
        fb_id: '7',
      })
        .then((user) => {
          expect(user).to.be.an('object');
          expect(user).to.have.property('fbId');
          expect(user.fbId).to.equal('7');
          done();
        });
    });

    it('updates and returns an existing User', (done) => {
      let userCount = 0;

      Knex('users').select()
        .then((users) => {
          userCount = users.length;
          // eslint-disable-next-line camelcase
          return Users.findOrCreate({fb_id: '1'});
        })
        .then((user) => {
          expect(user).to.be.an('object');
          expect(user).to.have.property('fbId');
          expect(user.fbId).to.equal('1');
          return Knex('users').select();
        })
        .then((users) => {
          expect(users.length).to.equal(userCount);
          done();
        });
    });
  });
});
