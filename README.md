[![cicd](https://github.com/mdb/node-consul-kv/actions/workflows/cicd.yaml/badge.svg)](https://github.com/mdb/node-consul-kv/actions/workflows/cicd.yaml)

# consul-kv

A tiny NPM package providing a minimal [Consul KV store](https://www.consul.io/api/kv.html) client.

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
});
```

### Usage

Create or update a key:

```javascript
const resp = await consul.set('my/key', 'my-key-value');
```

Read a key:

```javascript
const result = await consul.get('my/key');

console.log(result.value); // the key's value; undefined if it doesn't exist
console.log(result.responseStatus); // the HTTP status code of the Consul response
console.log(result.responseBody); // the HTTP body of the Consul response
```

Read a the full subtree below a key (this adds a `?recurse` query to the request, per [Consul documentation](https://www.consul.io/api/kv.html)):

```javascript
const result = await consul.get('my/key', { recurse: true });

console.log(result); // the entire 'my/key' subtree
console.log(result.responseStatus); // the HTTP status code of the Consul response
console.log(result.responseBody); // the HTTP body of the Consul response
```

Delete a key:

```javascript
const resp = await consul.delete('my/key');
```

Bonus: issue your own requests & get the raw response:

```javascript
const resp = await consul.request({
  key: 'my/key',
  body: 'my-value-or-optional-request-body',
  method: 'put'
});
```

## Development

Install dependencies & run unit tests:

```
npm install
npm test
```

Run end-to-end tests against a local Consul using [docker-compose](https://docs.docker.com/compose/):

```
docker compose up --detach
npm run test:e2e
```
