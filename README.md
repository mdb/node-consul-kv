# consul-kv

A tiny NPM package providing a Promise-based interface to [Consul KV store](https://www.consul.io/api/kv.html).

## Using consul-kv

### Instantiating:

```javascript
const Consul = require('consul-kv');

const consul = new Consul({
  host: 'my-consul.com', // required
  token: 'my-acl-token', // optional
  tlsCert: '<your-cert>', // optional
  tlsKey: '<your-cert-key>', // optional
  ca: '<your-ca-cert>', // optional
  port: '8500', // optional; defaults to '8500'
  protocol: 'https', // optional; defaults to 'https'
  strictSSL: true, // optional; defaults to true
});
```

### Usage

Create or update a key:

```javascript
consul.set('my/key', 'my-key-value')
  .then(respBody => {
    console.log(respBody);
  }, rejectedErr => {
    console.log(rejectedErr);
  });
```

Read a key:

```javascript
consul.get('my/key')
  .then(result => {
    console.log(result.value); // the key's value; undefined if it doesn't exist
    console.log(result.responseStatus); // the HTTP status code of the Consul response
    console.log(result.responseBody); // the HTTP body of the Consul response
  }, rejectedErr => {
    console.log(rejectedErr);
  });
```

Read a the full subtree below a key (this adds a `?recurse` query to the request, per [Consul documentation](https://www.consul.io/api/kv.html)):

```javascript
consul.get('my/key', { recurse: true })
  .then(result => {
    console.log(result); // the entire 'my/key' subtree
    console.log(result.responseStatus); // the HTTP status code of the Consul response
    console.log(result.responseBody); // the HTTP body of the Consul response
  }, rejectedErr => {
    console.log(rejectedErr);
  });
```

Delete a key:

```javascript
consul.delete('my/key')
  .then(respBody => {
    console.log(respBody);
  }, rejectedErr => {
    console.log(rejectedErr);
  });
```

Bonus: issue your own requests & get the raw response:

```javascript
consul.request({
  key: 'my/key',
  body: 'my-value-or-optional-request-body',
  method: 'put'
}).then(resp => {
  console.log(resp);
}, rejected => {
  reject(rejected);
});
```

## Development

Install dependencies & run tests:

```
npm install
npm test
```
