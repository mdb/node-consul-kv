const assert = require('assert');
const nock = require('nock');
const Consul = require('../consul');
const consulHost = 'my-consul.com';
const consul = new Consul({
  host: consulHost,
  token: 'my-token',
  tlsCert: 'cert',
  tlsKey: 'key'
});

const host = `https://${consulHost}:8500`;
const endpoint = '/v1/kv/my/key?token=my-token';

function mockGet(query) {
  const url = query ? `${endpoint}${query}` : endpoint;

  return nock(host)
    .get(url)
    .reply(200, [{
      Value: 'bXktdmFsdWU='
    }]);
}

function mockGet404() {
  return nock(host)
    .get(endpoint)
    .reply(404, []);
}

function mockPut() {
  return nock(host)
    .put(endpoint, 'my-value')
    .reply(200, 'true');
}

function mockDelete() {
  return nock(host)
    .delete(endpoint)
    .reply(200, 'true');
}

describe('get', () => {
  describe('when it 200s', () => {
    it('returns the decoded value for the key it is passed', (done) => {
      mockGet();

      consul.get('my/key')
        .then(val => {
          assert.equal(val.value, 'my-value');

          done();
        });
    });

    it('returns the status code of the response', (done) => {
      mockGet();

      consul.get('my/key')
        .then(val => {
          assert.equal(val.responseStatus, 200);

          done();
        });
    });

    describe('when it is passed the option to recursively return the entire subtree', () => {
      it('adds "?recurse" to the request it makes', (done) => {
        mockGet('&recurse');

        consul.get('my/key', { recurse: true })
          .then(val => {
            assert.equal(val.value, 'my-value');

            done();
          });
      });
    });

    describe('when it is passed the option to speicfy the datacenter to query', () => {
      it('adds "?dc=my-dc" to the request it makes', (done) => {
        mockGet('&dc=my-dc');

        consul.get('my/key', { dc: 'my-dc' })
          .then(val => {
            assert.equal(val.value, 'my-value');

            done();
          });
      });
    });

    it('returns the body of the response', (done) => {
      mockGet();

      consul.get('my/key')
        .then(val => {
          assert.equal(JSON.parse(val.responseBody)[0].Value, 'bXktdmFsdWU=');

          done();
        });
    });
  });

  describe('when it 404s', () => {
    it('reports the value as undefined', (done) => {
      mockGet404();

      consul.get('my/key')
        .then(val => {
          assert.equal(val.value, undefined);

          done();
        });
    });
  });
});

describe('set', () => {
  it('sets the key/value it is passed', (done) => {
    mockPut();

    consul.set('my/key', 'my-value')
      .then(result => {
        assert.equal(result, 'true');

        done();
      });
  });
});

describe('delete', () => {
  it('deletes the key/value it is passed', (done) => {
    mockDelete();

    consul.delete('my/key')
      .then(result => {
        assert.equal(result, 'true');

        done();
      });
  });
});
