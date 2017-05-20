[![Build Status](https://travis-ci.org/mdb/node-consul-kv.svg?branch=master)](https://travis-ci.org/mdb/node-consul-kv)

# consul-kv

A tiny NPM package for interacting with [Consul KV store](https://www.consul.io/api/kv.html).

## Using this thing

### Instantiating:

```javascript
var Consul = require('consul-kv');

var consul = new Consul({
  host: 'my-consul.com', // required
  token: 'my-acl-token', // required
  tlsCert: '<your-cert>', // required
  tlsKey: '<your-cert-key>', // required
  port: '8500', // defaults to '8500'
  protocol: 'https', // defaults to 'https'
  strictSSL: true, // defaults to true
});
```

### Usage

Read a key:

```javascript
consul.get('my/key')
  .then(value => {
    console.log(value);
  }, rejectedErr => {
    console.log(rejectedErr);
  });
```

Create or update a key:

```javascript
consul.set('my/key', 'my-key-value')
  .then(respBody => {
    console.log(respBody);
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

## Development

Install dependencies & run tests:

```
npm install
npm test
```
