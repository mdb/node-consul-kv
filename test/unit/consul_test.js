const assert = require('assert');
const nock = require('nock');
const Consul = require('../../consul');
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
  describe('when Consul responses with an HTTP 200', () => {
    let val;
    let err;

    beforeEach(async () => {
      mockGet();

      try {
        val = await consul.get('my/key');
      } catch(e) {
        err = e;
      }
    });

    afterEach(() => {
      val = undefined;
      err = undefined;
    });

    it('does not error', () => {
      assert.equal(err, undefined);
    });

    it('returns the decoded value for the key it is passed', () => {
      assert.equal(val.value, 'my-value');
    });

    it('returns the status code of the response', () => {
      assert.equal(val.responseStatus, 200);
    });

    it('returns the body of the response', () => {
      assert.equal(val.responseBody[0].Value, 'bXktdmFsdWU=');
    });

    describe('when it is passed the option to recursively return the entire subtree', () => {
      beforeEach(async () => {
        mockGet('&recurse');

        try {
          val = await consul.get('my/key', { recurse: true });
        } catch(e) {
          err = e;
        }
      });

      it('does not error', () => {
        assert.equal(err, undefined);
      });

      it('adds "?recurse" to the request it makes and returns the decoded value for the specified key', () => {
        assert.equal(val.value, 'my-value');
      });
    });

    describe('when it is passed an option specifying the specific datacenter to query', () => {
      beforeEach(async () => {
        mockGet('&dc=my-dc');

        try {
          val = await consul.get('my/key', { dc: 'my-dc' });
        } catch(e) {
          err = e;
        }
      });

      it('does not error', () => {
        assert.equal(err, undefined);
      });

      it('adds "?dc=my-dc" to the request it makes and returns the decoded value of the specified key', () => {
        assert.equal(val.value, 'my-value');
      });
    });
  });

  describe('when Consul responses with an HTTP 404', () => {
    let err;

    beforeEach(async () => {
      mockGet404();

      try {
        await consul.get('my/key');
      } catch(e) {
        err = e;
      }
    });

    afterEach(() => {
      err = undefined;
    });

    it('throws an error', () => {
      assert.equal(err.code, 'ERR_BAD_REQUEST');
    });
  });
});

describe('set', () => {
  describe('when Consul responses with an HTTP 200', () => {
    let result;
    let err;

    beforeEach(async () => {
      mockPut();

      try {
        result = await consul.set('my/key', 'my-value');
      } catch(e) {
        err = e;
      }
    });

    afterEach(() => {
      result = undefined;
      err = undefined;
    });

    it('does not error', () => {
      assert.equal(err, undefined);
    });

    it('sets the key/value it is passed', () => {
      assert.equal(result, true);
    });
  });
});

describe('delete', () => {
  describe('when Consul responses with an HTTP 200', () => {
    let result;
    let err;

    beforeEach(async () => {
      mockDelete();

      try {
        result = await consul.delete('my/key');
      } catch(e) {
        err = e;
      }
    });

    afterEach(() => {
      result = undefined;
      err = undefined;
    });

    it('does not error', () => {
      assert.equal(err, undefined);
    });

    it('deletes the key/value it is passed', () => {
      assert.equal(result, true);
    });
  });
});
