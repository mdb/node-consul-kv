'use strict';

const axios = require('axios');

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
          responseStatus: resp.status,
          responseBody: resp.data,
          value: resp.status === 200 ? new Buffer.from(resp.data[0].Value, 'base64').toString('utf-8') : undefined
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
        fulfill(resp.data);
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
        fulfill(resp.data);
      }, rejected => {
        reject(rejected);
      });
    });
  }

  request(opts) {
    const config = this.config;

    return new Promise((fulfill, reject) => {
      axios({
        url: `${config.protocol}://${config.host}:${config.port}/v1/kv/${opts.key}?token=${config.token}${opts.recurse ? '&recurse' : ''}${opts.dc ? '&dc=' + opts.dc : ''}`,
        method: opts.method || 'get',
        strictSSL: config.strictSSL,
        agentOptions: {
          cert: config.tlsCert,
          key: config.tlsKey,
          ca: config.ca
        },
        data: opts.body
      })
        .then(resp => {
          fulfill(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

module.exports = Consul;
