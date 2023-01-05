const assert = require('assert');
const Consul = require('../../consul');
const consul = new Consul({
  host: 'localhost',
  protocol: 'http'
});

describe('set', () => {
  describe('when Consul responses with an HTTP 200', () => {
    let result;
    let err;

    beforeEach(async () => {
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

describe('get', () => {
  describe('when Consul responses with an HTTP 200', () => {
    let val;
    let err;

    beforeEach(async () => {
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
  });

  describe('when Consul responses with an HTTP 404', () => {
    let err;

    beforeEach(async () => {
      try {
        await consul.get('my/nonexistent-key');
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

describe('delete', () => {
  describe('when Consul responses with an HTTP 200', () => {
    let result;
    let err;

    beforeEach(async () => {
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
