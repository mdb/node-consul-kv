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

function mockGet() {
  return nock(host)
    .get(endpoint)
    .reply(200, [{
      Value: 'bXktdmFsdWU='
    }]);
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
