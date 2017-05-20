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

  get(key) {
    return new Promise((fulfill, reject) => {
      this.makeRequest({
        key: key
      }).then(resp => {
        fulfill(new Buffer.from(JSON.parse(resp.body)[0].Value, 'base64').toString('utf-8'));
      }, rejected => {
        reject(rejected);
      });
    });
  }

  set(key, value) {
    return new Promise((fulfill, reject) => {
      this.makeRequest({
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
      this.makeRequest({
        key: key,
        method: 'delete'
      }).then(resp => {
        fulfill(resp.body);
      }, rejected => {
        reject(rejected);
      });
    });
  }

  makeRequest(opts) {
    let config = this.config;

    return new Promise((fulfill, reject) => {
      request({
        url: `${config.protocol}://${config.host}:${config.port}/v1/kv/${opts.key}?token=${config.token}`,
        method: opts.method || 'get',
        strictSSL: false,
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
