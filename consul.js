'use strict';

const request = require('request');

class Consul {
  constructor(opts) {
    this.config = Object.assign({
      port: '8500',
      protocol: 'https',
      strictSSL: true
    }, opts);
  }

  get(key, opts) {
    return new Promise((fulfill, reject) => {
      this.request(Object.assign({
        key: key
      }, opts)).then(resp => {
        fulfill({
          responseStatus: resp.statusCode,
          responseBody: resp.body,
          value: resp.statusCode === 200 ? new Buffer.from(JSON.parse(resp.body)[0].Value, 'base64').toString('utf-8') : undefined
        });
      }, rejected => {
        reject(rejected);
      });
    });
  }

  set(key, value) {
    return new Promise((fulfill, reject) => {
      this.request({
        key: key,
        body: value,
        method: 'put'
      }).then(resp => {
        fulfill(resp.body);
      }, rejected => {
        reject(rejected);
      });
    });
  }

  delete(key) {
    return new Promise((fulfill, reject) => {
      this.request({
        key: key,
        method: 'delete'
      }).then(resp => {
        fulfill(resp.body);
      }, rejected => {
        reject(rejected);
      });
    });
  }

  request(opts) {
    let config = this.config;

    return new Promise((fulfill, reject) => {
      request({
        url: `${config.protocol}://${config.host}:${config.port}/v1/kv/${opts.key}?token=${config.token}${opts.recurse ? '&recurse' : ''}`,
        method: opts.method || 'get',
        strictSSL: config.strictSSL,
        agentOptions: {
          cert: config.tlsCert,
          key: config.tlsKey
        },
        body: opts.body
      }, (err, resp) => {
        if (err) reject(err);

        fulfill(resp);
      });
    });
  }
}

module.exports = Consul;
