const assert = require('assert');
const Consul = require('../../consul');
const consul = new Consul({
  host: 'localhost',
  protocol: 'http'
});

describe('set', () => {
  it('sets the key/value it is passed', (done) => {
    consul.set('my/key', 'my-value')
      .then(result => {
        assert.equal(result, true);

        done();
      });
  });
});

describe('get', () => {
  describe('when it 200s', () => {
    it('returns the decoded value for the key it is passed', (done) => {
      consul.get('my/key')
        .then(val => {
          assert.equal(val.value, 'my-value');

          done();
        });
    });

    it('returns the status code of the response', (done) => {
      consul.get('my/key')
        .then(val => {
          assert.equal(val.responseStatus, 200);

          done();
        });
    });

    describe('when it is passed the option to recursively return the entire subtree', () => {
      it('adds "?recurse" to the request it makes', (done) => {
        consul.get('my/key', { recurse: true })
          .then(val => {
            assert.equal(val.value, 'my-value');

            done();
          });
      });
    });

    it('returns the body of the response', (done) => {
      consul.get('my/key')
        .then(val => {
          assert.equal(val.responseBody[0].Value, 'bXktdmFsdWU=');

          done();
        });
    });
  });

  describe('when it 404s', () => {
    it('throws an error', (done) => {
      consul.get('my/foo')
        .catch(err => {
          assert.equal(err.code, 'ERR_BAD_REQUEST');

          done();
        });
    });
  });
});

describe('delete', () => {
  it('deletes the key/value it is passed', (done) => {
    consul.delete('my/key')
      .then(result => {
        assert.equal(result, true);

        done();
      });
  });
});
