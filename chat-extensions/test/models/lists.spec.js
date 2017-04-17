import {expect} from 'chai';
import {describe} from 'mocha';

import knex from '../../db/knex';
import Lists from '../../models/lists';

// Test comparator values are created in `test/sample-seeds` file.
const DEFAULT_TITLE = 'Shopping List';
const LIST_1_TITLE = DEFAULT_TITLE;
const LIST_2_TITLE = 'To Do List';
const USER_1_FB_ID = '1';
const USER_2_FB_ID = '2';

describe('List', () => {
  beforeEach((done) => {
    knex.migrate.latest()
      .then(() => {
        knex.seed.run().then(() => done());
      });
  });

  afterEach((done) => {
    knex.migrate.rollback().then(() => done());
  });

  describe('addUser', () => {
    it('adds a new User to the List', (done) => {
      Lists.getAllUsers(3)
        .then((users) => {
          expect(users).to.have.length(2);
          expect(users[0].fbId).to.not.equal('1');

          return Lists.addUser(3, 1);
        })
        .then((usersList) => {
          expect(usersList).to.have.property('owner');
          expect(usersList).to.have.property('listId');
          expect(usersList.listId).to.equal(3);
          expect(usersList.owner).to.equal(false);

          return Lists.getAllUsers(3);
        })
        .then((users) => {
          expect(users).to.have.length(3);

          const newUser = users.find((user) => user.fbId === '1');

          expect(newUser).to.exist;
          expect(newUser).to.be.an('object');
          done();
        });
    });
  });

  describe('create', () => {
    it('creates a new List with the given title', (done) => {
      const newListTitle = 'My New List';
      Lists.create(newListTitle)
        .then((list) => {
          expect(list).to.be.an('object');
          expect(list).to.have.property('title');
          expect(list.title).to.equal(newListTitle);
          done();
        });
    });

    it('creates a List with default title if no title is given', (done) => {
      Lists.create()
        .then((list) => {
          expect(list).to.be.an('object');
          expect(list).to.have.property('title');
          expect(list.title).to.equal(DEFAULT_TITLE);
          done();
        });
    });
  });

  describe('get', () => {
    it('returns the requested List', (done) => {
      Lists.get(1)
        .then((list) => {
          expect(list).to.be.an('object');
          expect(list).to.have.property('title');
          expect(list.title).to.equal(LIST_1_TITLE);
          done();
        });
    });

    it('returns Undefined when the requested List does not exist', (done) => {
      Lists.get(6)
        .then((list) => {
          expect(list).to.be.an('undefined');
          done();
        });
    });
  });

  describe('getAll', () => {
    it('returns an Array of all Lists', (done) => {
      Lists.getAll()
        .then((lists) => {
          expect(lists).to.have.lengthOf(3);
          expect(lists[0]).to.be.an('object');
          expect(lists[0]).to.have.property('title');
          done();
        });
    });
  });

  describe('getAllItems', () => {
    it('returns an Array of all Items for a List', (done) => {
      Lists.getAllItems(1)
        .then((items) => {
          expect(items).to.have.lengthOf(3);
          expect(items[0]).to.be.an('object');
          expect(items[0]).to.have.property('name');
          expect(items[0]).to.have.property('listId');
          expect(items[0]).to.have.property('ownerFbId');
          expect(items[0]).to.have.property('completerFbId');
          done();
        });
    });

    it('returns an empty Array when there are no Items/List', (done) => {
      Lists.getAllItems(6)
        .then((items) => {
          expect(items).to.have.lengthOf(0);
          expect(items).to.be.an('array');
          done();
        });
    });
  });

  describe('getAllUsers', () => {
    it('returns an Array of all Users of a List', (done) => {
      Lists.getAllUsers(1)
        .then((users) => {
          expect(users).to.have.lengthOf(3);
          expect(users[0]).to.be.an('object');
          expect(users[0]).to.have.property('fbId');
          done();
        });
    });

    it('returns an empty Array when there are no Users/List', (done) => {
      Lists.getAllUsers(1)
        .then((users) => {
          expect(users).to.have.lengthOf(3);
          expect(users[0]).to.be.an('object');
          expect(users[0]).to.have.property('fbId');
          done();
        });
    });
  });

  describe('getForUser', () => {
    it("returns a User's owned Lists", (done) => {
      Lists.getForUser(1)
        .then((lists) => {
          expect(lists).to.be.an('array');
          expect(lists).to.have.length(2);
          expect(lists[0]).to.have.property('id');
          expect(lists[0]).to.have.property('title');
          expect(lists[0].id).to.equal(1);
          expect(lists[0].title).to.equal(LIST_1_TITLE);
          done();
        });
    });
  });

  describe('getOwnedForUser', () => {
    it("returns a User's owned Lists", (done) => {
      Lists.getOwnedForUser(1)
        .then((lists) => {
          expect(lists).to.be.an('array');
          expect(lists).to.have.length(1);
          expect(lists[0]).to.have.property('id');
          expect(lists[0]).to.have.property('title');
          expect(lists[0].id).to.equal(1);
          expect(lists[0].title).to.equal(LIST_1_TITLE);
          done();
        });
    });
  });

  describe('getSharedToUser', () => {
    it("returns a User's shared, unowned Lists", (done) => {
      Lists.getSharedToUser(1)
        .then((lists) => {
          expect(lists).to.be.an('array');
          expect(lists).to.have.length(1);
          expect(lists[0]).to.have.property('id');
          expect(lists[0]).to.have.property('title');
          expect(lists[0].id).to.equal(2);
          expect(lists[0].title).to.equal(LIST_2_TITLE);
          done();
        });
    });
  });

  describe('getWithUsers', () => {
    it('returns a list with an array of subscriberIds', (done) => {
      Lists.getWithUsers(1)
        .then((list) => {
          expect(list).to.be.an('object');
          expect(list).to.have.property('subscriberIds');
          expect(list.subscriberIds).to.have.length(3);
          expect(list.subscriberIds[0]).to.equal('1');
          done();
        });
    });
  });

  describe('getOwner', () => {
    it('returns the User object for the owner of the given List', (done) => {
      Promise.all([
        Lists.getOwner(1),
        Lists.getOwner(2),
        Lists.getOwner(3),
      ]).then((owners) => {
        expect(owners[0]).to.be.an('object');
        expect(owners[0]).to.be.have.property('fbId');
        expect(owners[0].fbId).to.equal(USER_1_FB_ID);
        expect(owners[1].fbId).to.equal(USER_2_FB_ID);
        expect(owners[2].fbId).to.equal(USER_2_FB_ID);
        done();
      });
    });

    it('returns Undefined if there is no owner for the given List', (done) => {
      Lists.getOwner(4)
        .then((user) => {
          expect(user).to.be.an('undefined');
          done();
        });
    });
  });

  describe('setOwner', () => {
    it('sets a User as the owner of a list', (done) => {
      Lists.create('My Ownerless List')
        .then((list) => {
          return Lists.setOwner(list.id, 1);
        })
        .then((usersList) => {
          expect(usersList).to.have.property('owner');
          expect(usersList.owner).to.equal(true);
          done();
        });
    });

    it('resets the existing List Owner, if there is one', (done) => {
      knex('users_lists')
        .where({list_id: 1, user_fb_id: 1}) // eslint-disable-line camelcase
        .first()
        .then((usersList) => {
          expect(usersList.owner).to.equal(true);
        }).then(() =>
          Lists.setOwner(1, 3))
        .then((usersList) => {
          expect(usersList).to.have.property('owner');
          expect(usersList.owner).to.equal(true);

          knex('users_lists')
            .where({list_id: 1, user_fb_id: 1}) // eslint-disable-line camelcase
            .first()
            .then((usersList) => {
              expect(usersList.owner).to.equal(false);
              done();
            });
        });
    });
  });

  describe('setTitle', () => {
    it('updates the title of a given List', (done) => {
      const newTitle = 'My Renamed List';

      Lists.setTitle(newTitle, 1)
        .then((list) => {
          expect(list).to.be.an('object');
          expect(list.title).to.equal(newTitle);
          done();
        });
    });

    it('resets to a default value if no name is provided', (done) => {
      Promise.all([
        Lists.setTitle(null, 1),
        Lists.setTitle(undefined, 2),
      ]).then((lists) => {
        expect(lists[0]).to.be.an('object');
        expect(lists[0].title).to.equal(DEFAULT_TITLE);
        expect(lists[1]).to.be.an('object');
        expect(lists[1].title).to.equal('');
        done();
      });
    });
  });
});
